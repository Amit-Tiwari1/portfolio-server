import 'dotenv/config'
import mongoose from "mongoose";

 async function connectDB (){
    try {
        const MONGO_URI = process.env.MONGODB_CONNECTION_STRING!;
        if(!MONGO_URI){
            console.error("MONGO_URI environment variable is not defined.")
            process.exit(1);
        }
       await mongoose.connect(MONGO_URI,{
            
        });
        console.log("Database connected!")
    } catch (error) {
        console.log(`Database connection error:: ${error}`)
        process.exit(1);
    }
}

export default connectDB;