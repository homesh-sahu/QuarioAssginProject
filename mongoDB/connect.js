import mongoose from "mongoose";

const connectDB = (url) => {
    mongoose.connect(url,{dbName:'Cars'})                   //Connecting to the DB
        .then( () => console.log('Database Connected') )
        .catch( (err) => console.log(err) );
};

export default connectDB;