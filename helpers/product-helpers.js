const db = require('../config/connection')
const collection = require('../config/collections')
const collections = require('../config/collections')
var objectId=require('mongodb').ObjectID
module.exports={

     addProduct:(product,callback)=>{

           console.log(product)

           db.get().collection('product').insertOne(product).then((data)=>{
               console.log(data)
               callback(data.ops[0]._id)

              
           })
           },

            
           getAllProducts:()=>{

            return new Promise(async(resolve,reject)=>{
                let products=await db.get().collection(collections.PRODUCT_COLLECTION).find().toArray()
              
                resolve(products)


            })



            },

            deleteProduct:(prodId)=>{
                return new Promise((resolve,reject)=>{
                   
                 db.get().collection(collection.PRODUCT_COLLECTION).removeOne({_id:objectId(prodId)}).then((response)=>{
                   console.log(response)
                    resolve(response)
                 })
                })

            },
            getProductDeatiles:(prodId)=>{

                return new Promise((resolve,reject)=>{
               db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:objectId(prodId)}).then((response)=>{

                    resolve(response)
                })

                })
            },
            updateProduct:(prodId,proDeatails)=>{

                return new Promise((resolve,reject)=>{

                    db.get().collection(collection.PRODUCT_COLLECTION).updateOne({_id:objectId(prodId)},{

                        $set:{

                            Name:proDeatails.Name,
                            Description:proDeatails.Description,
                            Price:proDeatails.Price,
                            Category:proDeatails.Category

                             
                        }

                    }).then((response)=>{
                        resolve()
                    })
                })
            }
             
 }



