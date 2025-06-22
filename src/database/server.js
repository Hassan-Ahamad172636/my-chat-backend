import mongoose from "mongoose";
import { DATABASE_NAME } from "../constants.js";

// src/database/server.js
export async function databaseConnection() {
  try {
    await mongoose.connect(`${process.env.DATABASE_URL}${DATABASE_NAME}`);
    console.log(
      "\n==================================\n database connected successfully! \n==================================\n"
    );
  } catch (error) {
    console.log(
      "\n==================================\n network error! \n==================================\n"
    );
  }
}