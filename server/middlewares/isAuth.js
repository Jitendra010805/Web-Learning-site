import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';   


export const isAuth =async (req, res, next) => {
    try{
        const token =req.headers.token;

        if(!token){
            return res.status(403).json({ message: "Login First" });
        }
        const decodeData=jwt.verify(token,process.env.JWT_Sec);
        req.user=await User.findById(decodeData._id);
        next();
    }catch(error){
        return res.status(401).json({ message: "Login First" });
    }
};

export const isAdmin=(req,res,next)=>{
    try{
        if(req.user.role!=="admin"){
          return res.status(403).json({
                message:"Access denied, Admins only",
            });
        }
        next();

    }catch(error){
        res.status(500).json({
            message:error.message,
        });

    }
};