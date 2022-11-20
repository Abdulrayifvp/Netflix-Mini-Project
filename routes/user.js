const express = require('express');
const session = require('express-session');
const router = express.Router();
const MovieHelpers = require('../Helpers/Movie-helpers');
const userHelpers = require('../Helpers/User-helpers')
 
/* GET home page. */
router.get('/', function(req, res, next) {
  if(req.session.loggedIn){ 
    let user = req.session.user[0]
   
    
    MovieHelpers.getMovies().then((movies)=>{
      res.render('user/index', {movies,user});
    })
  }else{
    MovieHelpers.getMovies().then((movies)=>{
      res.render('user/index', {movies});
    })
  }
  
  
  
});

router.get('/login',(req,res)=>{
  if(req.session.loggedIn){
    res.redirect('/')
  }else{
    
      res.render('user/login',{loginErr:req.session.loginErr})
      req.session.loginErr=false
      
    
  }
})
router.post('/login',(req,res)=>{
  userHelpers.doLogin(req.body).then((response)=>{
    if(response.status){
      if(response.user[0].admin==true){
        req.session.loggedIn=true
      req.session.user=response.user
      res.redirect('/admin')
      }else if(response.user[0].admin=="superadmin"){
        req.session.loggedIn=true
      req.session.user=response.user
      res.redirect('/super-admin')
      }else{
        req.session.loggedIn=true
        req.session.user=response.user
        res.redirect('/')
      }
      
    }else{
      req.session.loginErr=response.errMsg
      res.redirect('/login')
    }
  })
  
})

router.get('/signup',(req,res)=>{
  res.render('user/signup',{userExist:req.session.userExist})
  req.session.userExist=null
})

router.post('/signup',(req,res)=>{
  userHelpers.doSignup(req.body).then((response)=>{
    if(response.userExist){
      console.log("user exist")
      req.session.userExist="User already Exist"
      res.redirect('/signup')
    }else{
      console.log(response);
      userHelpers.doLogin(req.body).then((response)=>{
        if(response.status){
          req.session.loggedIn=true
          req.session.user=response.user
          res.redirect('/')
        }
        })
    }
    
  })
})

router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')

})
module.exports = router;
