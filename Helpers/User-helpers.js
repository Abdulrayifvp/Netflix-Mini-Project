const db = require("../config/connection");
const collections = require("../config/collections");
const { response } = require("express");
const objectId = require('mongodb').ObjectId

module.exports = {
    doSignup:(userData)=>{
        userData.admin=false
        return new Promise(async(resolve,reject)=>{
            let user =await db.get().collection(collections.USER_COLLECTIONS).findOne({email:userData.email})
            let state={
                userExist:false
            }
            console.log(user)
            if(!user){
                    db.get().collection(collections.USER_COLLECTIONS).insertOne(userData).then((data)=>{
                        resolve(data)
                    })      
            }else{
                state.userExist=true
                resolve(state)
            }
        })
   
    },
    addAdmin:(userData)=>{
        userData.admin=true
        return new Promise(async(resolve,reject)=>{
            let admin = await db.get().collection(collections.USER_COLLECTIONS).findOne({email:userData.email})
            let state = {
                adminExist:false
            }
            console.log(admin);
            if(!admin){
                db.get().collection(collections.USER_COLLECTIONS).insertOne(userData).then((data)=>{
                    resolve(data)
                })
            }else{
                state.adminExist=true
                resolve(state)
            }
        
        })
        
    },
    getUsers:()=>{
        return new Promise(async(resolve,reject)=>{
            let users =await db.get().collection(collections.USER_COLLECTIONS).find({admin:{$in:[false]}}).toArray()
            resolve(users)
        })
    },
    getAdmin:()=>{
        return new Promise(async(resolve,reject)=>{
            let admins =await db.get().collection(collections.USER_COLLECTIONS).find({admin:{$in:[true]}}).toArray()
            resolve(admins)
            console.log(admins);
        })
    },
    
    
    doLogin:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            let user =await db.get().collection(collections.USER_COLLECTIONS).find({email:userData.email}).toArray()
            console.log(user[0]);
            if(user[0]!=undefined){
                let status = false
                let response={}
                if(userData.password==user[0].password){
                    console.log("login success");
                    response.user = user
                    response.status = true
                    resolve(response)

                }else{
                    console.log("Incorrect password");
                    let response = {}
                    response.errStatus = false,
                    response.errMsg = "Incorrect password"
                
                resolve(response)
                }
            }else{
                console.log("Incorrect email");
                let response = {}
                    response.errStatus = false,
                    response.errMsg = "User not found"
                
                resolve(response)
            }
        })
    },
    removeUser:(userId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.USER_COLLECTIONS).deleteOne({_id:objectId(userId )}).then((response)=>{
                resolve(response)
            })
        })
    },
    getUserDetails:(userId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.USER_COLLECTIONS).findOne({_id:objectId(userId)}).then((response)=>{
                resolve(response)
            })
        })
    },
    updateUser:(userId,userData)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collections.USER_COLLECTIONS).updateOne({_id:objectId(userId)},{
                $set:{
                    firstName:userData.firstName,
                    secondName:userData.secondName,
                    email:userData.email,
                    password:userData.password,
                    confirmPassword:userData.confirmPassword
                }
            }).then((response)=>{
                resolve()
            })
        })
    }, 
    
}