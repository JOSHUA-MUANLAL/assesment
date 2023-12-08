const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();


router.use(bodyParser.json());

router.get('/registration', (req, res) => {
   
    res.render('templates/registration');
});

router.post('/registration',(req,res)=>{
    const user_name=req.body.user_name;
    const email=req.body.email;
    const password=req.body.password;
    const data={
        used:'done'
    };

    res.render('templates/registration',data)


})
 module.exports=router;