import dotenv from "dotenv";
import express from 'express';  
import mongoose from "mongoose";  


export const connectDb = async () => {
   try {
    const conn = await mongoose.connect(process.env.DB);
    console.log(`✅ Database Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error.message.includes("querySrv EREFUSED")) {
      console.error("❌ ERROR: Database connection failed (DNS Error).");
      console.error("👉 FIX: Try switching your computer's DNS to Google DNS (8.8.8.8) or Cloudflare DNS (1.1.1.1).");
    } else {
      console.error("❌ Database connection error:", error.message);
    }
  }
}       
