const express = require("express");
const app = express();
const ejs = express("ejs");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const Ricecalendar = require("./models/calendar2.js");
const methodOverride = require("method-override");
const { render } = require("ejs");
const { message } = require("statuses");
const router = express.Router();
app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: true }));
app.set("view egine", "ejs");
app.use(methodOverride("_method"));
mongoose.connect("mongodb://localhost:27017/RiceDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log("Sucessfully connected");
    })
    .catch(e => {
        console.log("Failed to connected");
        console.log(e);
    });

const today = new Date();
const month = today.getMonth();
const date = today.getDate();
const systemdate = { month, date };

//Estalbish Router
router.get("/", (req, res) => {
    res.render("ricecalendar.ejs", { systemdate });
});
// user input data
router.post("/", async (req, res) => {

    try {
        let plotid = req.body.plotid;
        let todothing = req.body.todothing;
        let tododate = req.body.tododate;
        let plantingdate = req.body.transplant_day;
        //Old plot Update data (for blockchain)
        // if (Ricecalendar.findOne({plotid}!==null)){
        //     await Ricecalendar.updateMany(
        //         { plotid:plotid},
        //         { $push:{Trace_data:{todothing:todothing,tododate:tododate}} },
        //         {new: true,runValidators: true, upsert: true});
        //     console.log("Data already Update");  
        //     }

        //Normal Data type no array/upadte transplant day if user didnot input
        let newinputdata = new Ricecalendar({
            plotid: plotid,
            Transplant_Date: plantingdate,
            todothing: todothing,
            tododate: tododate,
        });
        console.log(newinputdata);
        console.log("New Trace Data is establishes");
        newinputdata.save().then(() => { console.log("Data already saved"); });
        //Ajax response message
        var message = {
            check: "",
            datanumber: "",
            GDD: "",
        };
        searchdata = await Ricecalendar.findOne({ plotid });
        // old plot data transplantday renew
        hisdate = searchdata["Transplant_Date"];
        await Ricecalendar.updateMany(
            { plotid: plotid },
            { Transplant_Date: hisdate },
            { new: true, upsert: true });
        // GDD datetime data transform and caulate
        let date1 = new Date(hisdate);
        let date2 = new Date(tododate);
        days = Math.abs(date2 - date1);
        GDD = days / (1000 * 3600 * 24);
        await Ricecalendar.updateOne(
            { tododate: tododate },
            { Operation_GDD: GDD },
            { new: true, upsert: true });

        console.log("Data already Update");
        //Count plot tracebilible data number
        searchvalue = await Ricecalendar.find({ plotid:plotid }).count();
        if (searchvalue > 1) {
            message.check = "this is Old Plot.";
            message.datanumber = "You have " + searchvalue + " Tracebilable Data.";
            message.GDD = "This data GDD is " + GDD;
            res.send(message);
        }
        else {
            message.check = "This is New Resgisterted Plot, Welcome";
            message.datanumber = "You have One Tracebilable Data.";
            message.GDD = "This data GDD is " + GDD;
            res.send(message);
        }
    }
    catch { res.send("Error"); }

});
//AgroTracebility Page
function mergeTime(arr1,arr2) {
    let result = [];
    let i = 0;
    let j =0;
  
    while (i<arr1.length && j<arr2.length) {
        let date1 = new Date(arr1[i].tododate);
        let date2 = new Date(arr2[j].tododate);
        if (Number(date1.getTime())>Number(date2.getTime())){
            result.push(arr2[j]);
            j++;
        }
        else if (Number(date1.getTime())<Number(date2.getTime())){
            result.push(arr1[i]);
            i++;
        }
        else if (Number(date1.getTime())==Number(date2.getTime())){
            result.push(arr2[j]);
            j++;
            result.push(arr1[i]);
            i++;
        }
    }

    while (i<arr1.length) {
        result.push(arr1[i]);
        i++;
    }
    while (j<arr2.length) {
         result.push(arr2[j]);
         j++;
    }
    return result;
};

function MergeSort (arr) {
    if (arr.length===1){
        return arr;
    }
    else {
        let middle = Math.floor(arr.length/2);
        let left = arr.slice(0,middle);
        let right = arr.slice(middle,arr.length);
        return mergeTime(MergeSort(right),MergeSort(left));
    }
        }


router.post("/agrotrace/:plotid", async(req, res) => {
    let userid = req.params.plotid;
    console.log(userid);
    try
    {
        let userdata = await Ricecalendar.find({plotid:userid});
        let naridata = await Ricecalendar.find({plotid:"NARI-Standard-2"});
        // Sort userdata by date
        let userdatasort=MergeSort(userdata); 
        // find userdatasort transplant day and program into Nari calendar
        let usertransplantday = await Ricecalendar.find(
            {$and:[{plotid:userid},
                {Operation_GDD: 0},
            ]}
                ); 
        res.render("agrotracebility.ejs",{userdatasort,naridata,usertransplantday,userid});
    }
    catch { 
        res.send("Error"); 
    }
});


app.use("/", router);
app.listen(3000, () => {
    console.log("You are in the port 3000");
});

