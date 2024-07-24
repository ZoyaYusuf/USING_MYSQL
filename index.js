const { faker, tr } = require('@faker-js/faker');
const mysql = require("mysql2");
const express = require("express");
const app = express();
const path = require("path");
const methodoverride = require("method-override");

app.use(methodoverride("_method"));
app.use(express.urlencoded({extended: true}));
app.set("view engine","ejs");
app.set("views", path.join(__dirname, "/views"));

let getRandomUser = () => {
    return[
      faker.string.uuid(),
      faker.internet.userName(),
      faker.internet.email(),
      faker.internet.password(),
    ];
  }

const connection = mysql.createConnection({  //no awwait
    host: 'localhost',
    user: 'root',
    database: 'delta_app',
    password: 'zoyasql',
});

app.get("/",(req,res) =>{
  let q = "select count(*) from USER";
  try{
      connection.query(q ,(err,result) =>{
        {
          if(err) throw err;
          let count = result[0]['count(*)'];
          res.render("home.ejs" ,{count});
        }
      });
    }
      catch(err){
      console.log(err);
      res.send("fail");
    }
}); 

app.get("/user", (req,res) => {
  let q = `SELECT * FROM USER`;
  try{
    connection.query(q ,(err,users) =>{
      {
        if(err) throw err;
        res.render("showusers.ejs", {users});
      }
    });
  }
    catch(err){
    console.log(err);
    res.send("fail");
  }
}); 

app.get("/user/:id/edit",(req,res)=>{
  let {id} = req.params;
  let q = `SELECT * FROM USER WHERE id = '${id}'`;
  try{
    connection.query(q ,(err,result) =>{
      {
        if(err) throw err;
        let user = result[0];
        res.render("edit.ejs",{user});
      }
    });
  }
    catch(err){
    console.log(err);
    res.send("fail");
  }
}); 

app.patch("/user/:id", (req, res)=>{
  let {id} = req.params;
  let {password: form_pswd, username : newusername} = req.body;
  let q = `SELECT * FROM USER WHERE id = '${id}'`;
  try{
      connection.query(q ,(err,result) =>{
          if(err) throw err; 
          let user = result[0];
          if(form_pswd != user.password){
            res.send("wrong pswd");
          }else{
            let q2 = `UPDATE USER SET username='${newusername}' WHERE id='${id}'`;
            connection.query(q2, (err,result)=>{
              if (err) throw err;
              res.redirect("/user");
            })
          }
      });
    }
      catch(err){
      console.log(err);
      res.send("fail");
    }
}); 

//hw: add new user and delete user

app.listen("3000", ()=>{
  console.log(`listening to 8080`);
})


  
  // let q = "INSERT INTO USER(id, username, email, password) VALUES ?";
  
  // let data = [];

  // for (let i=1;i<=100;i++){
  //   data.push(getRandomUser());
  // }

//   try{
//   connection.query(q , [data], (err,result) =>{
//     {
//       if(err) throw err;
//       console.log(result);

//     }
//   })
// }
//   catch(err){
//   console.log(err);
// }

// connection.end();
//  //console.log(getRandomUser
