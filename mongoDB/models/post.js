import mongoose from "mongoose";

const Post = new mongoose.Schema({                  //Schema Defination for DB collections/models
    cname : { type: String, required: true },
    mfgy : { type: String, required: true },
    price : {type: Number, required: true},
});

const PostSchema =  mongoose.model('Post', Post);   //Creating a collection(similar to table in SQL)

export default PostSchema;