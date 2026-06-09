import { User } from "../models/User.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sendMail from "../middlewares/sendMail.js";
import TryCatch from "../middlewares/TryCatch.js";

export const register = TryCatch(async (req, res) => {
  const { name, email, password, role } = req.body;

  let user = await User.findOne({ email });
  if (user)
    return res.status(400).json({ message: "User already exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  user = {
    name,
    email,
    password: hashedPassword,
    role,
  };

  const otp = Math.floor(Math.random() * 100000);

  const activationToken = jwt.sign(
    {
      user,
      otp,
    },
    process.env.Activation_Secret,
    {
      expiresIn: "5m",
    }
  );

  const data = {
    name,
    otp,
  };

  await sendMail(email, "OTP Verification", data);

  res.status(200).json({
    message: "OTP sent to your email",
    activationToken,
  });
});

// Verify User (empty for now)
export const verifyUser = TryCatch(async (req, res) => {
 console.log("✅ /api/user/verify called"); // add this

  const { otp, activationToken } = req.body;
  console.log("Body:", req.body); // log received data

  const verify = jwt.verify(activationToken, process.env.Activation_Secret);
  console.log("Decoded token:", verify);

  if (!verify) {
    return res.status(400).json({ message: "OTP Expired" });
  }
  if (verify.otp != otp) {
    return res.status(400).json({ message: "Invalid OTP" });
  }

  const newUser = await User.create({
    name: verify.user.name,
    email: verify.user.email,
    password: verify.user.password,
    role: verify.user.role,
  });

  console.log("✅ User saved:", newUser);

  res.json({
    message: "User verified successfully",
  });

});

export const loginUser=TryCatch(async(req,res)=>{
    const{email,password}=req.body;
    const user=await User.findOne({email});
    if(!user){
        return res.status(400).json({message:"User does not exist"});
    }
    const mathpassword=await bcrypt.compare(password,user.password);
    if(!mathpassword){
        return res.status(400).json({message:"Invalid Credentials"});
    }
    const token=jwt.sign(
        {
            _id:user._id,
        },
        process.env.JWT_Sec,{
            expiresIn:"15d",

        }
    );
    res.json({
        message:`welcome back ${user.name}`,
        token,
        user,
    });

    
});

export const myProfile=TryCatch(async(req,res)=>{
    const user=await User.findById(req.user._id);
    res.json({
        user
    });
});

export const forgotPassword = TryCatch(async (req, res) => {
    const { email } = req.body;
  
    const user = await User.findOne({ email });
  
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
  
    const token = jwt.sign({ email: user.email }, process.env.Forgot_Secret, {
      expiresIn: "15m",
    });
  
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    const url = `${frontendUrl}/reset-password/${token}`;
  
    const data = { url };
  
    await sendMail(email, "Reset Password", data);
  
    res.json({ message: "Reset password link sent to your email" });
  });
  
  export const resetPassword = TryCatch(async (req, res) => {
    const { token } = req.query;
    const { password } = req.body;
  
    try {
      const decoded = jwt.verify(token, process.env.Forgot_Secret);
  
      const user = await User.findOne({ email: decoded.email });
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      const hashedPassword = await bcrypt.hash(password, 10);
  
      user.password = hashedPassword;
  
      await user.save();
  
      res.json({ message: "Password updated successfully" });
    } catch (error) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }
  });
