import dotenv from "dotenv";
import express from 'express';  
import mongoose from "mongoose";  


export const connectDb = async () => {
   try {
    const conn = await mongoose.connect(process.env.DB);
    console.log(`✅ Database Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error.message.includes("querySrv EREFUSED") || error.message.includes("querySrv ENOTFOUND")) {
      console.error("❌ ERROR: Database connection failed (DNS SRV Error).");
      console.error("👉 FIX 1: If running locally, try switching your DNS server to Google DNS (8.8.8.8) or Cloudflare DNS (1.1.1.1).");
      console.error("👉 FIX 2: Use the standard (legacy) connection string format starting with 'mongodb://' instead of 'mongodb+srv://' in your environment variables.");
    } else {
      console.error("❌ Database connection error:", error.message);
    }
  }
}       
