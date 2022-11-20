const { response } = require('express');
const express = require('express');
const router = express.Router();
const MovieHelpers = require('../Helpers/Movie-helpers');
const UploadHelper = require("../Helpers/Movie-helpers");
const UserHelpers = require('../Helpers/User-helpers');

router.get('/',(req,res)=>{
    MovieHelpers.getMovies().then((movies)=>{
        console.log(movies);
        res.render('admin/View-uploads', {movies,admin:true,superAdmin :true});
      })
})

router.get('/subscribers',(req,res)=>{
    UserHelpers.getUsers().then((users)=>{
    //   console.log(users)
      if(users==[]){
      res.render('admin/view-user',{users :false, admin : true,superAdmin :true})
      }else{
      
      
      res.render('admin/view-user',{users, admin : true,superAdmin :true})
      }
      
    })
  
    }
    
  )
  router.get('/control',(req,res)=>{
    UserHelpers.getAdmin().then((admins)=>{
      console.log(admins)
      if(admins==[]){
      res.render('admin/view-admin',{admins :false, admin : true,superAdmin :true})
      }else{
      
      
      res.render('admin/view-admin',{admins, admin : true,superAdmin :true})
      }
      
    })
  
    }
    
  )

  router.get('/create-admin',(req,res)=>{
    // res.send('ok')
    res.render('admin/create-admin',{ admin : true,superAdmin :true,adminExist:req.session.adminExist})
    req.session.adminExist=null
  })
  
  router.post('/create-admin',(req,res)=>{
    UserHelpers.addAdmin(req.body).then((response)=>{
        if(response.adminExist){
            console.log("admin exist")
            req.session.adminExist="Admin already Exist"
            res.redirect('/super-admin/create-admin') 
        }else{
            res.redirect('/super-admin/control')
        }
      
    })
  })

  router.get('/remove-user',(req,res)=>{
    let userId = req.query.id
    console.log(userId);
    UserHelpers.removeUser(userId).then((response)=>{
      res.redirect("/super-admin/control")
    })
  
  })
  
  router.get('/edit-admin',async(req,res)=>{
    let user=await UserHelpers.getUserDetails(req.query.id)
    // console.log(user);
    res.render('admin/edit-admin',{user,admin : true,superAdmin :true})
  })
  
  router.post('/edit-admin',(req,res)=>{
    console.log(req.query.id);
    // console.log(req.body);
     UserHelpers.updateUser(req.query.id,req.body).then(()=>{
        res.redirect("/super-admin/control")
     })
  }) 
module.exports = router;