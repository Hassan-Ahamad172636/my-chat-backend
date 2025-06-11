import mongoose from "mongoose";
import { DATABASE_NAME } from "../constants.js";

export const databaseConnection = async () => {
    console.log("1");
    
    try {
        console.log("2");
        await mongoose.connect(`${process.env.DATABASE_URL}${DATABASE_NAME}`);
        console.log("3");
        console.log('\n==================================\n database connected successfully! \n==================================\n');
        console.log("4");
        
    } catch (error) {
        console.log('\n==================================\n network error! \n==================================\n');
    }
}