
import mongoose from "mongoose";
import { CLOUD_URI , LOCAL_URI } from "../config/config.service.js";

const connectDB = async()=>{
    try {
        await mongoose.connect(LOCAL_URI, {serverSelectionTimeoutMS: 5000,});
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.log('MongoDB connection failed' , error);
    }
};

export default connectDB;