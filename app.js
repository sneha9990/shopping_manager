const express = require("express")
const path = require("path")
const app= express() 
const port=80 ;
const mongoose = require('mongoose');


mongoose.connect('mongodb://127.0.0.1:27017/contactshop' , {useNewUrlParser: true  });
mongoose.createConnection('mongodb://127.0.0.1:27017/collection' , {useNewUrlParser: true  });
mongoose.createConnection('mongodb://127.0.0.1:27017/show' , {useNewUrlParser: true  });
 

var contactSchema = new mongoose.Schema({
    name: String ,
    phone:String,
    email:String,
    query:String,
  });
const regSchema = new mongoose.Schema({
    name: String ,
    phone: String ,
    email: String ,
    pwd: String 
})
const showSchema = new mongoose.Schema({
    link : String 
})


const contact = mongoose.model('contact', contactSchema);
const collection =  mongoose.model('collection' , regSchema)
const show =  mongoose.model('show' , showSchema)


app.use(express.urlencoded({extended:false})) ;

app.use('/static' , express.static('static'))                         //for serving static files
app.use(express.static(path.join(__dirname , 'static'))) ;

app.set('view engine' , 'pug')                                       //set the template engine as pug                                     
app.set('views' , path.join(__dirname , 'views'))                    // set the directory

app.locals.basedir = path.join(__dirname, 'static');


app.get('/' , (req,res)=>{
    const params={ }
    res.status(200).render('home.pug' , params) ;
})
app.get('/contact' , (req,res)=>{
    const params={ }
    res.status(200).render('contact.pug' , params) ;
})
app.get('/register' , (req,res)=>{
    const params={ }
    res.status(200).render('register.pug' , params) ;
})
app.get('/logout' , (req,res)=>{
    res.status(200).render('home.pug') ;
})
app.get('/about' , (req,res)=>{
    const params={ }
    res.status(200).render('about.pug' , params) ;
})
app.get('/sponsors' , (req,res)=>{
    const params={ }
    res.status(200).render('sponsors.pug' , params) ;
})


app.post('/contact' , (req,res)=>{
     var myData = new contact(req.body) ;
     myData.save().then(()=>{
        res.send("submission has been saved to database")
     }).catch(()=>{
        res.status(404).send("Failed to save the submission to database")
     }) ;
})

app.post('/register' , async (req,res)=>{
    const data={
        name:req.body.name ,
        pwd: req.body.pwd ,
        email: req.body.email ,
        phone: req.body.phone 
    }
    await collection.insertMany([data])
    res.render('home2.pug')
})

app.post("/login" , async (req,res)=>{
    var myData2 = new contact(req.body) ;
     myData2.save().then(()=>{
        res.render("home2.pug")
     }).catch(()=>{
        res.status(404).send("wrong details")
     }) ;
})

app.post("/show" , async (req,res)=>{
    var data= ({link: req.body.link}) 
    
    // let data = req.body.link ;
    await show.insertMany(data)
    // res.render('data.pug' , data) ;
    res.send(data) ;
})

app.get("/this", (req, res)=>{
    res.status(404).send("page not found");
});
app.listen(port, ()=>{
    console.log(`The application started successfully on port ${port}`);
});