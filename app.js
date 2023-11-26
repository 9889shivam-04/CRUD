const express= require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const path=require('path');
const multer =require('multer');
const app=express();

const upload=multer({dest:'uploads/'});
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));

//connect monggose
mongoose.connect('mongodb://127.0.0.1:27017/data',{useNewUrlParser:true,useUnifiedTopology:true})
.then(()=>{
    console.log('Connected Successfully');
})
.catch((err)=>{
    console.error('Error',err);
})
//Crreat Model
const index=mongoose.model('solo',{
name:String,
password:String,
email:String,
dob:String,
image:String,
gender:String,



}
)

app.use(bodyParser.urlencoded({
    extended:true
}));
//gettin Form
app.get('/',(req,res)=>{
    res.sendFile(__dirname+'/index.html');
});


  

 //Delete

 app.get('/delete/:id', (req, res) => {
   const userId = req.params.id;
 
   // Use Mongoose to find and remove the user by userId
   index.findByIdAndDelete(userId)
     .then(user => {
       if (user) {
         // User found and deleted successfully
         // Redirect to the list of users after deletion
         res.redirect('/index');
       } else {
         // User with the specified ID not found
         res.status(404).send('User not found');
       }
     })
     .catch(err0 => {
       console.error('Error deleting user: ', err);
       res.status(500).send('Error deleting user');
     });
 });

 //Delete


 //edit data
 app.get('/edit/:id',(req,res)=>{
   const  userid=req.params.id;

   index.findById(userid).then(
    user=>{
        console.log('User found',user);
        if(user){
            //redner data the edit form
          res.render('Edit_form',{user})
        }
        else{
            res.status(404).send('User Not Found')
        }
    }
   )
 })

 app.get('/edit/:id', async (req, res) => {
    const userId = req.params.id;
  
    try {
      const user = await index.findById(userId);
      if (user) {
        res.render('editform', { user });
      } else {
        res.status(404).send('User not found');
      }
    } catch (err) {
      console.error('Error rendering edit form: ', err);
      res.status(500).send('Error rendering edit form');
    }
  });

 //edit data
 app.post('/edit/:id', upload.single('image'), async (req, res) => {
    const userId = req.params.id;
    const { name, email, dob, password, gender } = req.body;
    const image = req.file ? req.file.filename : null;
  
    try {
      const user = await index.findById(userId);
      if (user) {
        user.name = name;
        user.email = email;
        user.dob = dob;
        user.password = password;
        if (image) user.image = image;
        user.gender = gender;
        await user.save();
        res.redirect('/index');
      } else {
        res.status(404).send('User not found');
      }
    } catch (err) {
      console.error('Error editing user: ', err);
      res.status(500).send('Error editing user');
    }
  });
  
  
 //edit save

 //edit save

//insert data
app.post('/submit',upload.single('image'),(req,res)=>

{
 
    const {name,password,email,dob,gender}=req.body;
    const image=req.file.filename;

    console.log(name)
    const search=new index({
        name,password,email,dob,image,gender
        
    })
    search.save().then(()=>{
        res.send('User data send succfully');
    })
    .catch((err)=>{
        console.error('Error',err);
        res.status(500).send('Error saving error');
    })
})
//show data
app.get('/index',(req,res)=>{
    index.find({}).then(index=>{
        const table=`
        <table>
        <tr>
        <th>Full Name</th>
        
        <th>Email</th>
        <th>Password</th>
        <th>D.O.B</th>
        <th>Image</th>
        <th>Gender</th>
        <th>Action</th>
      




        </tr>
        
        
        ${index.map((index1)=>`
        <tr>
        
        <td>${index1.name}</td>
        
        <td>${index1.email}</td>
        &nbsp;
        <td>${index1.password}</td>
        &nbsp;
        <td>${index1.dob}</td>
        <td><img src="/uploads/${index1.image}" height="10px",width="10px"</td>
        <td>${index1.gender}</th>
<td>
<a href="/edit/${index1._id}">Edit</a> |
<a href="/delete/${index1._id}">Delete</a>
</td>

        


        <tr/>
        
        `).join('')}

        <table/>`
        res.send(table);
})
.catch((err)=>{
    console.error('error fetching',err);
    res.status(500).send('error');
});
    })
app.use('/uploads',express.static(path.join(__dirname,'uploads')));



const PORT =process.env.PORT || 3000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})

