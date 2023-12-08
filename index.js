const express=require('express');
const mysql=require('mysql2')
const app=express();
const session=require('express-session')


app.use(session({
    secret: 'joshua', 
    // Change this to a secret key for better security
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 86400000, // Set the expiration time in milliseconds (e.g., 24 hours)
      }
  }));
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', 'D:/COLLEGE/assesment');


// create connection
var con = mysql.createConnection({
    host: "sql12.freesqldatabase.com",
    port: 3306,
    user: "sql12668750",
    password: "xE2Lj2BjdM",
    database:"sql12668750"
  });



//REGISTRATION




app.get('/',(req,res)=>{
    res.render('templates/form');

})

app.get('/registration', (req, res) => {
   
    res.render('templates/registration');
});

app.post('/registration',(req,res)=>{
    const user_name=req.body.user_name;
    const email=req.body.email;
    const password=req.body.password;

    const entry={
        user_name:user_name,
        email:email,
        password:password
    }

    //to check if email is available
    con.connect((err)=>{
        if (err) throw err;
        con.query("SELECT email From user_detail WHERE email=?",[email],function (err, result) {
            if (err) throw err;
            if (result.length === 0) { 
                // Check if the result array is empty
                console.log('Email available');
                //TO check if user name is available
                con.query("SELECT user_name FROM user_detail WHERE user_name=?",[user_name],function(err,result2){
                    if (err) throw err;
                    if (result2.length===0){

                        console.log("user is available")
                        con.query("INSERT INTO user_detail SET ? ",entry, function (err, result) {
                            if (err) throw err;
                            console.log("1 record inserted");
        
                            var data={
                                done:"registered"
                            }
                            res.render("templates/form",data)
                          });



                    }else{
                        //user name is taken
                        console.log("user name is taken")
                        var data={taken:"User name is taken"}
                            res.render('templates/registration',data)
                        }
                    
                })
                
                

               
              } else {
                //email already in use
                console.log('Email already taken');

                const data={
                    used:"email is already in used"
                }
                res.render('templates/registration',data)
              }

            
          });
          
    })

   

    


})


//LOGIN ROUTE

app.get('/login',(req,res)=>{
    console.log(session.user)

    if (req.session.user){
        var user=req.session.user;
        console.log("available")

        var data={
            user:user};

        res.render('templates/userinterface',data);
    }
    else{
        console.log("not available")
        res.render('templates/login')
    }

    
})


app.post('/login',(req,res)=>{
    const user=req.body.user;
    const password=req.body.password;

    con.connect((err)=>{
        if (err) throw err;
        con.query("SELECT * FROM user_detail where user_name=? and password=?",[user,password],(err,result)=>{
            if (err) throw err;
    
            if (result!=0){
                req.session.username=user;
                req.session.password=password;
    
                var data={
                    user:user,
                    password:password
                };
                console.log(req.session);
                res.render("templates/userinterface",{ data: data });
            }
            else{
    
                var data={
                    data:"yout password of user in invalid"
                };
                res.render('templates/login',{data:data})
            }
        })
    })



})


//reset or forgot password
app.get('/forgot',(req,res)=>{
    res.render("templates/forgotpassword")
})


app.post('/forgot',(req,res)=>{

const email=req.body.mail;
con.connect((err)=>{
    if (err) throw err;
    con.query("SELECT password FROM user_detail WHERE email=?",[email],(err,result)=>{
        if (err) throw err;
    
        if (result.length>0){
           
            res.render('templates/forgotpassword',{result:result[0]})
    
        }
    })
})



})





app.listen(3000, () => {
    console.log('Server is running on http://localhost:3000');
});
