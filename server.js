const express = require('express')
require('dotenv').config()
const app = express();
app.use(express.json());
app.use("/",express.static("./public"));
const mysql = require("mysql2");
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.listen(2500,(req,res)=>{
    console.log("started")
})


app.post('/',(req,res) =>{
    min_sal = req.body.min_sal
    gpa = req.body.gpa
    intrest = req.body.intrest
    retriveResult(min_sal,gpa,intrest,function(err,data){
        if (err) {
            // error handling code goes here
            console.log("ERROR : ",err);            
        } else {            
            // code to execute on data retrieval
            obj = JSON.parse(data);
            console.log(obj);
            res.json(obj)
        }    
    })
})


function retriveResult(min_sal,gpa,intrest,callback){
    let db = mysql.createConnection({
        host:process.env.host,
        user:process.env.user,
        password:process.env.password,
        port:process.env.port,
        database:process.env.database
    });

    db.connect(function(err){
        //SQL command
        let sql = "SELECT major, min_salary, intrest, req_gpa FROM `major` where min_salary >= "+min_sal+" AND req_gpa >=" +gpa+" AND intrest LIKE '%"+intrest+"%';";

        //exeucte command
        db.query(sql, function(err,result){
        
            if(err) callback(err,null);

            //if no errors
            callback(null,JSON.stringify(result));
        })
    })

}