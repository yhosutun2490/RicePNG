
let section = document.querySelector("section")
let add = document.querySelector("form button");
add.addEventListener("click", e => { 
    e.preventDefault();
    //get input value
   let form =  e.target.parentElement;
   console.log(form.children);
   let todothing = form.children[0].value;
   let todomonth = form.children[1].value;
   let tododate = form.children[2].value;
   // if input value is empty string
   if (todothing === "") {
       alert("Please enter valid text.");
       return ;
   }
   // create a todo item (create html paragraph idea)
   let todo = document.createElement("div");
   todo.classList.add("todoalldata");
   let text = document.createElement("p");
   text.classList.add("todo-text");
   text.innerText=todothing;
   let time = document.createElement("p");
   time.classList.add("todo-time");
   time.innerText=todomonth +" / "+tododate;
   // 在父層element加入子元素
   todo.appendChild(text);
   todo.appendChild(time);
   //create green checked and red trash button
   let completebutton = document.createElement("button");
   completebutton.classList.add("complete");
   completebutton.innerHTML='<i class="fa-solid fa-check"></i>';
   //complete button event bind
   completebutton.addEventListener("click", e => {
       let todoitem = e.target.parentElement;
       todoitem.classList.toggle("done");
   })
   let trashbutton = document.createElement("button");
   trashbutton.classList.add("trash");
   trashbutton.innerHTML='<i class="fa-regular fa-trash-can"></i>';
   //trash button event bind
   trashbutton.addEventListener("click", e => {
       let todoitem = e.target.parentElement;
       todoitem.addEventListener("animationend", () => {
            // remove from localStorage
            let text = todoitem.children[0].innerText;
            let mylistArray = JSON.parse(localStorage.getItem("list"));
            mylistArray.forEach((item,index) => {
                if (item.todothing==text) {
                    mylistArray.splice(index,1);
                    localStorage.setItem("list",JSON.stringify(mylistArray));}
                })
            todoitem.remove();
        })
    todoitem.style.animation="scaledown 0.5s forwards";
})

   todo.appendChild(completebutton);
   todo.appendChild(trashbutton);
   //crate animation
   todo.style.animation = "scaleup 0.5s forwards";
   // Create an object
   let mytodo ={
       todothing: todothing,
       todomonth: todomonth,
       tododate: tododate
   };

   // storage array data into an object
   let mylist = localStorage.getItem("list");
   if (mylist == null) {
       localStorage.setItem("list",JSON.stringify([mytodo]));
    }
       else {
           let mylistArray = JSON.parse(mylist);
           mylistArray.push(mytodo);
           localStorage.setItem("list", JSON.stringify(mylistArray));
       }

   console.log(JSON.parse(localStorage.getItem("list")));

   form.children[0].value="";
   section.appendChild(todo);
 
})

loadData();

function loadData () {
// Load localstorage data  and construct DOM into Web
let mylist = localStorage.getItem("list");
if (mylist !== null) {
    let mylistArray = JSON.parse(mylist);
    mylistArray.forEach(item => {
        // Recreate todo form localStorage
        let todo = document.createElement("div");
        todo.classList.add("todoalldata");
        let text = document.createElement("p");
        text.classList.add("todo-text");
        text.innerText = item.todothing;
        let time = document.createElement("p");
        time.classList.add("todo-time");
        time.innerText = item.todomonth+" / "+item.tododate;
        todo.appendChild(text);
        todo.appendChild(time);
         //create green checked and red trash button
         let completebutton = document.createElement("button");
         completebutton.classList.add("complete");
         completebutton.innerHTML='<i class="fa-solid fa-check"></i>';
          //complete button event bind
        completebutton.addEventListener("click", e => {
        let todoitem = e.target.parentElement;
        todoitem.classList.toggle("done");
        })
        let trashbutton = document.createElement("button");
        trashbutton.classList.add("trash");
        trashbutton.innerHTML='<i class="fa-regular fa-trash-can"></i>';
        //trash button event bind
        trashbutton.addEventListener("click", e => {
        let todoitem = e.target.parentElement;
        todoitem.addEventListener("animationend", e => {
            let text = todoitem.children[0].innerText;
            let mylistArray = JSON.parse(localStorage.getItem("list"));
            mylistArray.forEach((item,index) => {
                if (item.todothing==text) {
                    mylistArray.splice(index,1);
                    localStorage.setItem("list",JSON.stringify(mylistArray));}
                })
                todoitem.remove();})
        todoitem.style.animation="scaledown 0.5s forwards";})
        todo.appendChild(completebutton);
        todo.appendChild(trashbutton);
        //crate animation
        todo.style.animation = "scaleup 0.5s forwards";
        section.appendChild(todo);
    })
}
}


function mergeTime(arr1,arr2) {
    let result = [];
    let i = 0;
    let j =0;
    while (i<arr1.length && j<arr2.length) {
        if (Number(arr1[i].todomonth)>Number(arr2[j].todomonth)){
            result.push(arr2[j]);
            j++;
        }
        else if (Number(arr1[i].todomonth)<Number(arr2[j].todomonth)){
            result.push(arr1[i]);
            i++;
        }
        else if (Number(arr1[i].todomonth)==Number(arr2[j].todomonth)){
            if(Number(arr1[i].tododate) > Number(arr2[j].tododate)){
                result.push(arr2[j]);
                j++;}
            else {
                result.push(arr1[i]);
                i++;
            }
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
}

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


let sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click", () => {
    //sort data
    let sortedArray = MergeSort(JSON.parse(localStorage.getItem("list")));
    localStorage.setItem("list",JSON.stringify(sortedArray));
    // remove data and reconstrut web present
    let len = section.children.length;
    for (let i=0;i<len;i++){
        section.children[0].remove();
    }
    loadData();IN

})

