import express from "express"
import bodyParser from "body-parser"
import mongoose from "mongoose"
mongoose.connect('mongodb+srv://woeihaw94:ang0321zxc@cluster0.76ehtqz.mongodb.net/todoListDB',{useNewUrlParser: true});
const toDoListSchema = new mongoose.Schema({
    item:String,
})

const listTypeSchema = new mongoose.Schema({
    type:String,
    toDo: [toDoListSchema]
})
const List = mongoose.model("List",toDoListSchema)
const ListType = mongoose.model("ListType", listTypeSchema)
const app = express()
const port = 3000
var todoList = []

// var id_list_day = [] 
// var old_id_list_day = []
// var id_list_work = [] 
// var old_id_list_work = []
app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.listen(port,() =>{
    console.log(`Server running on port ${port}`)
})

app.get("/", (req,res) =>{
 
    (async()=>{
            try{
                todoList = await ListType.find({type:"daily"},"toDo");
                if (todoList.length ===0){
                    res.render("index.ejs", {type:"today", todoitems:[]})
                }else{
                    res.render("index.ejs", {type:"today", todoitems:todoList[0].toDo})
                }
            
            }catch(err){
                console.log(err)
            }
        } ) ();    
     
})

app.post("/delete",(req,res)=>{
    const itemId = req.body["checkbox"];
    (async()=>{
        try{
            await List.deleteOne({_id:itemId});
            await ListType.updateOne({type:"daily"},{$pull:{toDo:{_id:itemId}}})
        }catch(err){
            console.log(err)
        }
    })();

    res.redirect("/")
})

app.post("/delete_work",(req,res)=>{
    const itemId = req.body["checkbox"];
    (async()=>{
        try{
            await List.deleteOne({_id:itemId});
            await ListType.updateOne({type:"work"},{$pull:{toDo:{_id:itemId}}})
        }catch(err){
            console.log(err)
        }
    })();

    res.redirect("/work")
})

app.post("/submit",(req,res)=>{

    (async()=>{
        const list = new List({
            item:req.body["newItem"]
        })
        try{
            await list.save();
            if((await ListType.find({type:"daily"})).length === 0){
                
                await ListType.insertMany([{type:"daily", toDo:list}])
                
            }else{
                // const doc =await ListType.findOne({type:"daily"});
                // doc.item.push({
                //     $i
                // })
                await ListType.updateOne({type:"daily"},{$push:{toDo:list}});
            }
            console.log("data successfully saved")
        }catch(err){
            console.log(err);
        }finally{
            res.redirect("/")
        }
    })()

    
})

app.post("/save_today",(req,res)=>{ 
    res.redirect("/")

})

app.get("/work",(req,res) =>{
    (async()=>{
        try{
            todoList = await ListType.find({type:"work"},"toDo");
            
            if (todoList.length === 0){
                res.render("index.ejs",{type:"work", todoitems:[]})
            }else{
                
                res.render("index.ejs",{type:"work",todoitems:todoList[0].toDo})
            }
        }catch(err){
            console.log(err);
        }
    })()
   
})
app.post("/submit_work",(req,res)=>{
    

    (async()=>{
        const list = new List({
            item:req.body["newItem"]
        })
        try{
            await list.save();
            if((await ListType.find({type:"work"})).length === 0){
                
                await ListType.insertMany([{type:"work", toDo:list}])
                
            }else{
                // const doc =await ListType.findOne({type:"daily"});
                // doc.item.push({
                //     $i
                // })
                await ListType.updateOne({type:"work"},{$push:{toDo:list}});
            }
            console.log("data successfully saved")
        }catch(err){
            console.log(err);
        }finally{
            res.redirect("/work")
        }
    })()

    // todoListWork.push(req.body["newItem"]) 
    // res.redirect("/work") 

})

app.post("/save_work",(req,res)=>{
    res.redirect("/work")
})



// app.post("/send_data", (req, res) => {
    
//     const contentType = req.headers['content-type'];
//     if (contentType === 'application/json') {
//         // Content-Type is JSON, proceed with handling the request
//         const data = JSON.parse(req.body.data); // Access the data sent in the request body
//         const type = data.type
        
        
//         if(type === "today"){
            
//             id_list_day = data.id;
//             const uncheck_id_list_day = data.unchek_id
//             for(let i = 0 ; i<id_list_day.length; i++){
//                 old_id_list_day.push(id_list_day[i])
//             }
            
//             for(let i = 0 ; i<uncheck_id_list_day.length; i++){
//                 var index = old_id_list_day.indexOf(uncheck_id_list_day[i]);
//                 while(index !== -1){
//                     old_id_list_day.splice(index,1)
//                     index = old_id_list_day.indexOf(uncheck_id_list_day[i]);
//                 }
//             }
//             res.redirect("/")
//         }else{
//             id_list_work = data.id;
//             const uncheck_id_list_work = data.unchek_id
//             for(let i = 0 ; i<id_list_work.length; i++){
//                 old_id_list_work.push(id_list_work[i])
//             }
            
//             for(let i = 0 ; i<uncheck_id_list_work.length; i++){
//                 var index = old_id_list_work.indexOf(uncheck_id_list_work[i]);
//                 while(index !== -1){
//                     old_id_list_work.splice(index,1)
//                     index = old_id_list_work.indexOf(uncheck_id_list_work[i]);
//                 }
//             }
            
            
//             res.redirect("/work")
//         }
//         // res.send("Data received successfully!");
//     } else {
//         // Content-Type is not JSON, handle the error
//         res.status(400).send("Invalid Content-Type. Expected application/json.");
//     }
// });

