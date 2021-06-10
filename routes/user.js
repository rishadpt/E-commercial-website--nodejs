var express = require('express');
var router = express.Router();
const productHelpers=require('../helpers/product-helpers')
const userHelpers=require('../helpers/user-helper')

/* GET home page. */
const verifyLogin=(req,res,next)=>{
  if(req.session.loggedIn){
    next()
  }else{
 
   res.redirect('/login')
  }
 }
router.get('/',async function(req, res, next) {
  let user=req.session.user
  console.log(user)
  let cartcount=null
  if(req.session.user){
  cartcount=await userHelpers.getcartCount(req.session.user._id)
  }
  productHelpers.getAllProducts().then((products)=>{
   
  res.render('user/view-products', {products,user,cartcount});
    
  })
 
});
router.get('/login',function(req,res,next){
  if(req.session.loggedIn){
    res.redirect('/')
  }else{

  res.render('user/login',{loginErr:req.session.loginErr})
  req.session.loginErr=false
}})

router.get('/signup',function(req,res,next){

  res.render('user/signup')})


router.post('/signup',((req,res,next)=>{
userHelpers.doSignup(req.body).then((response)=>{

 
  req.session.loggedIn=true
  req.session.user=response
  res.redirect('/')

res.render('user/login')
})


}))

router.post('/login',((req,res,next)=>{

  userHelpers.doLogin(req.body).then((response)=>{

    if(response.status){
      req.session.loggedIn=true
      req.session.user=response.user
      res.redirect('/')

    }else{
      req.session.loginErr=true
      res.redirect('/login')
    }
  })



}))
router.get('/logout',(req,res)=>{

  req.session.destroy()
  res.redirect('/login')
})
router.get('/cart',verifyLogin,async(req,res)=>{
   
  let products=await userHelpers.getcartProducts(req.session.user._id)
 

  res.render("user/cart",{products,user:req.session.user})
})
router.get('/add-to-cart/:id',(req,res)=>{
  console.log("apicall")
  
  
  userHelpers.addtoCart(req.params.id,req.session.user._id).then(()=>{

    res.json({status:true})
  })
})
router.post('/change-product-quantity',(req,res,next)=>{

   console.log(req.body)
   userHelpers.changeproductQuantity(req.body).then(()=>{

   })
})

module.exports = router;
