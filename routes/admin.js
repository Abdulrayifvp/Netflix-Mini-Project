const { response } = require('express');
const express = require('express');
const router = express.Router();
const MovieHelpers = require('../Helpers/Movie-helpers');
const UploadHelper = require("../Helpers/Movie-helpers");
const UserHelpers = require('../Helpers/User-helpers');

/* GET users listing. */
router.get('/', function(req, res, next) {
  MovieHelpers.getMovies().then((movies)=>{
    console.log(movies);
    res.render('admin/View-uploads', {movies,admin:true});
  })
  
});

router.get('/upload',(req,res)=>{
  res.render('admin/upload-page',{admin : true})
})

router.post('/upload',(req,res)=>{
  console.log(req.body);
  console.log(req.files.Image);
  let image = req.files.Image
  UploadHelper.uploadMovies(req.body,(id)=>{
    
    image.mv('./public/images/'+id+'.jpg',(err,done)=>{
      if(!err){
        res.render("admin/upload-page",{admin : true})
      }else{
        console.log(err)
      }
    })
    
  })
})

router.get('/subscribers',(req,res)=>{
  UserHelpers.getUsers().then((users)=>{
    // console.log(users)
    if(users==[]){
    res.render('admin/view-user',{users :false, admin : true})
    }else{
    
    
    res.render('admin/view-user',{users, admin : true})
    }
    
  })

  }
  
)

router.get('/remove-user',(req,res)=>{
  let userId = req.query.id
  console.log(userId);
  UserHelpers.removeUser(userId).then((response)=>{
    res.redirect("/admin/subscribers")
  })

})

router.get('/edit-user',async(req,res)=>{
  let user=await UserHelpers.getUserDetails(req.query.id)
  // console.log(user);
  res.render('admin/edit-user',{user,admin : true})
})

router.post('/edit-user',(req,res)=>{
  console.log(req.query.id);
  // console.log(req.body);
   UserHelpers.updateUser(req.query.id,req.body).then(()=>{
     res.redirect('/admin/subscribers')
   })
}) 

router.get('/create-user',(req,res)=>{
  res.render('admin/create-user',{admin : true})
})

router.post('/create-user',(req,res)=>{
  UserHelpers.doSignup(req.body).then(()=>{
    res.redirect('/admin/subscribers')
  })
})

module.exports = router;
 