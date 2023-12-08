const express = require('express');
const{check, validationResult} = require("express-validator");
let formValidate = getFormValidation();
require('dotenv').config()
const app = express();
app.use(express.json());
app.use("/",express.static("./public"));
const mysql = require("mysql2");
app.use(express.json());
app.use(express.urlencoded({extended:false}));
const server  = app.listen(2500,(req,res)=>{
    console.log("started")
})


app.post('/',formValidate,(req,res) =>{
    const errors = validationResult(req)
    console.log(errors);
    if(!errors.isEmpty()){
        //errors
        const msg = "<h1>Sorry, we found errors with your submission </h1>" + printErrors(errors.array());
        res.status(500).send(msg)
    }
    else{
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
                res.status(200).send(obj)
            }    
    })
    }
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
        let sql = "SELECT major, min_salary, intrest, req_gpa FROM `major` where min_salary >= "+min_sal+" AND min_gpa >=" +gpa+" AND intrest LIKE '%"+intrest+"%';";

        //exeucte command
        db.query(sql, function(err,result){
        
            if(err) callback(err,null);

            //if no errors
            callback(null,JSON.stringify(result));
        })
    })

}
function getFormValidation(){
    //roles
    return [
        check('min_sal').isLength({min:3, max:6}).withMessage('the salary must be between 3 and 6 digits') 
        .isNumeric().withMessage("the salary must be a number")
        .matches('[1-9]+').withMessage("minimum salary must consist of numbers only")
        .trim().escape(),
        check('gpa').isLength({min:3,max:3}).withMessage('gpa must be under 5.0 and upove 0.0 with only two digits') 
        .isNumeric().withMessage("gpa must be a number")
        .matches('[0-5][.][0-9]').withMessage("gpa must consist of numbers only")
        .trim().escape(),
        check('intrest').custom(val=>{
            const whitelist = ['Very High', 'High', 'Medium', "Low"]
            if(whitelist.includes(val)) return true;
            return false;
        }).withMessage("unkown or unexpected selected item")
        .trim().escape()
    ]
}
function printErrors(errArray){
    let errors = [];
    for (let index = 0; index < errArray.length; index++) {
        let err = errArray[index]["msg"];
        let msg = "<p>-"+err+"</p>";
        errors.push(msg);
    }
    return errors.join("");
}
module.exports = server;