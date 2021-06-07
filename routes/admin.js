var express = require('express');
const productHelpers = require('../helpers/product-helpers');
var router = express.Router();


router.get('/', function(req, res, next) {
  productHelpers.getAllProducts().then((products)=>{
  res.render('admin/view-products',{admin:true,products})
  });
  })
 
  

router.get('/add-product',(req,res)=>{
 
  res.render('admin/add-product')

})

router.post('/add-product',(req,res)=>{

  console.log(req.body)
  console.log(req.files.Image)
  
 productHelpers.addProduct(req.body,(id)=>{

  var image=req.files.Image
  image.mv('./public/product-images/'+id+'.jpg',(err)=>{

   if(!err){
     res.render('admin/add-Product')
   } else{
     console.log(err)
   }

  })


 })
})

router.get('/delete-product/:id',(req,res)=>{
  let proId=req.params.id
  productHelpers.deleteProduct(proId).then((response)=>{

    res.redirect('/admin/')

  })



})

router.get('/edit-product/:id',async (req,res)=>{
  let products=await productHelpers.getProductDeatiles(req.params.id)
  console.log(products)

  res.render('admin/edit-product',{products})
})
router.post('/edit-product/:id',(req,res)=>{
  console.log(req.params.id)

  productHelpers.updateProduct(req.params.id,req.body).then(()=>{

    res.redirect('/admin')
    if(req.files.Image){

      let image=req.files.Image
      image.mv('./public/product-images/'+req.params.id+'.jpg')


    }
  })
})
module.exports = router;
