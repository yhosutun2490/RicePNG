const mongoose = require("mongoose");

const RiceSchema = new mongoose.Schema(
    {
    plotid:{
        type: String,
        required:true,},
    Transplant_Date:{
        type: Date,
        required:true,},
    Trace_data:[{ 
        todothing:{
            type: String,
            required:true,
        },
        tododate:{
            type: Date,
            required:true,
        },
        Operation_GDD:{
            type: Number,
            max: [120,"Too Old to Hrvest Your Rice"],
            min: [-20,"Too Early for Planting"],
        }
    }],
        // Detail:{
        //     type:String,
        // },
        // Chemical:{
        //     Name:{
        //         type: String,},
        //     Dosis:{
        //         type: Number,
        //         min: 0,}
        //         }
        // },
        }
)

const RiceCalendar=mongoose.model("Ricecalendar",RiceSchema);
module.exports= RiceCalendar;