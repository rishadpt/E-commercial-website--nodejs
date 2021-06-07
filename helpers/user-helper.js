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

        return new Promise(async(resolve,reject)=>{
            let userCart=await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
            if(userCart){
                db.get().collection(collection.CART_COLLECTION).updateOne({user:objectId(userId)},{


                    $push:{products:objectId(proId)}
                    
                }).then(()=>{

                    resolve()
                })


            }else{

                let cartObj={
                    user:objectId(userId),
                    products:[
                        objectId(proId)]
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
                  $lookup:{

                    from:collection.PRODUCT_COLLECTION,
                    let:{proList:'$products'},
                    pipeline:[
                        {

                           $match:{
                               
                            $expr:{
                                $in:['$_id',"$$proList"]
                            }
                           }
                        }
                    ],
                    as:'cartItems'
                  }
              }

          ]).toArray()
           resolve(cartItems[0].cartItems)
        })
    }
}