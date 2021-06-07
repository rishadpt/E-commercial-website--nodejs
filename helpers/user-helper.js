var db=require('../config/connection')
var collection=require('../config/collections')
const bcrypt = require('bcrypt')
var objectId=require('mongodb').ObjectID

module.exports={

    doSignup:(userdata)=>{
     return new Promise(async(resolve,reject)=>{

        userdata.Password=await bcrypt.hash(userdata.Password,10)
        db.get().collection(collection.USER_COLLECTION).insertOne(userdata).then((result)=>{

           resolve(result.ops[0])
        })
         

     })
      
    },

    doLogin:(userdata)=>{


        return new Promise(async(resolve,reject)=>{
        let loginStatus=false
        let response={}
       let user =await db.get().collection(collection.USER_COLLECTION).findOne({Email:userdata.Email})

       if (user){
           bcrypt.compare(userdata.Password,user.Password).then((status)=>{
            
           if(status){
               console.log("LOGIN SUCCESSFULL")
               response.user=user
               response.status=true
               resolve(response)

           }else{

            console.log("LOGIN FAILED")
            resolve({status:false})
           }
 
           })
               
       }else{

        console.log("Login failed")
        resolve({status:false})
       }

       


        
        })
    },
    addtoCart:(proId,userId)=>{
        let proObj={
            item:objectId(proId),
            quantity:1
        }

        return new Promise(async(resolve,reject)=>{
            let userCart=await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
            if(userCart){
                let proExist=userCart.products.findIndex(product=> product.item==proId)
                console.log(proExist)
                if(proExist!=-1){
                    db.get().collection(collection.CART_COLLECTION).updateOne({'products.item':objectId(proId)},
                    {

                        $inc:{'products.$.quantity':1}
                    }).then(()=>{
                        resolve()
                    })

                }
                else{
                db.get().collection(collection.CART_COLLECTION).updateOne({user:objectId(userId)},{


                    $push:{products:proObj}
                    
                }).then((response)=>{

                    resolve()
                })
                }

        }else{

                let cartObj={
                    user:objectId(userId),
                    products:[proObj]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                   
                    resolve()
                })
            }
        })

    },
    getcartProducts:(userId)=>{

        return new Promise(async(resolve,reject)=>{
        
          let cartItems=await db.get().collection(collection.CART_COLLECTION).aggregate([
              {

                 $match:{user:objectId(userId)}

              },
              {

                $unwind:'$products'
              },
              {
                   $project:{
                       item:'$products.item',
                       quantity:'$products.quantity'
                   }
              },{

                $lookup:{
                    from:collection.PRODUCT_COLLECTION,
                    localField:'item',
                    foreignField:'_id',
                    as:'product'
                }
              },
              {

                $project:{

                    item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
                }
              }

         ]).toArray()
         console.log(cartItems)
               resolve(cartItems)
        })
    },

    getcartCount:(userId)=>{

     return new Promise(async(resolve,reject)=>{

        let cart=await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
        let count=0
        if (cart){
            count=cart.products.length
             
              
        }
        resolve(count)
     })

    },
    changeproductQuantity:({cartID,proId,count})=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.CART_COLLECTION).updateOne({'products.item':objectId(proId)},
            {

                $inc:{'products.$.quantity':count}
            }).then(()=>{
                resolve()
            })


        })


    }
}