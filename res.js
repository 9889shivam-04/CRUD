app.post('/edit/:id' ,upload.single('image',async(req,res)=>{
    const userid=req.params.id;
    const{name,email,dob,password,gender}=req.body;
    const image=req.file?req.file.filename:null;
    try{
        const user=await DataTransferItemList.findById(userid);
        if(user){
            user.name=name;
            user.email=email;
            user.dob=dob;
            user.password=password;
            if(image)user.image=image;
            user.gender=gender;
            await user.save();
            res.redirect('/user');
        }
        else{
res.status(404).send('user is not found');
        }
    }
    catch(err){
        console.error('error edit user');
        res.status(505).send('error editing user');
    }
}
))