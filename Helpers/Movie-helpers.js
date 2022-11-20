const db = require("../config/connection");
const collections = require("../config/collections");
const { MONGO_CLIENT_EVENTS } = require("mongodb");

module.exports = {
    uploadMovies:(movie,callback)=>{
        console.log(movie);

        db.get().collection(collections.MOVIES_COLLECTIONS).insertOne(movie).then((data)=>{
            console.log(data)
            callback(data.insertedId)
        })
    },
    getMovies:()=>{
        return new Promise(async(resolve,reject)=>{
            let movies =await db.get().collection(collections.MOVIES_COLLECTIONS).find().toArray()
            resolve(movies)
        })
    } 
} 