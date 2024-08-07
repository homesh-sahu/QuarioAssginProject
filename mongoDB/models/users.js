import mongoose from "mongoose";

const Users = new mongoose.Schema({                  
    name : { type: String, required: true },
    pass : { type: String, required: true },
});

const UsersSchema =  mongoose.model('Users', Users);   

export default UsersSchema;