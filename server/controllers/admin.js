import TryCatch from "../middlewares/TryCatch.js";
import { Courses } from "../models/Courses.js";
import { Lecture } from "../models/Lecture.js";
import {rm} from "fs";
import { promisify } from "util";
import fs from "fs";
import {User} from "../models/User.js";

export const createCourse = TryCatch(async (req, res, next) => {
  const { title, description, category, createdBy, duration, price } = req.body;
  const image = req.file;

  await Courses.create({
    title,
    description,
    category,
    createdBy,
    duration,
    price,
    image: image?.path?.replace(/\\/g, '/'),
  });

  res.status(201).json({
    success: true,
    message: "Course created successfully",
  });
});

export const addLecture = TryCatch(async (req, res, next) => {
    const course=await Courses.findById(req.params.id)
    if(!course){
        return res.status(404).json({
            success:false,
            message:"Course not found",
        });
    }
    const {title,description}=req.body;

    const file=req.file;
    const lecture=await Lecture.create({
      title,
      description,
      video: file?.path?.replace(/\\/g, '/'),
      course:course._id,
    });

    res.status(201).json({
      message:"Lecture added successfully",
      lecture,
    });

  
});

export const deleteLecture=TryCatch(async(req,res)=>{ 
  const lecture=await Lecture.findByIdAndDelete(req.params.id);

  rm(lecture.video,()=>{
    console.log("File deleted successfully");
  });

  await lecture.deleteOne();

  res.json({
    message:"Lecture deleted successfully",
  });
});

export const addNotes = TryCatch(async (req, res, next) => {
    const lecture = await Lecture.findById(req.params.id);
    if (!lecture) {
        return res.status(404).json({
            success: false,
            message: "Lecture not found",
        });
    }

    const file = req.file;
    if (file) {
        lecture.notes = file.path.replace(/\\/g, '/');
        await lecture.save();
    }

    res.status(201).json({
        success: true,
        message: "Notes added successfully",
        lecture,
    });
});

const unlinkAsync = promisify(fs.unlink);

export const deleteCourse=TryCatch(async(req,res)=>{
  const course=await Courses.findById(req.params.id);

  const lectures=await Lecture.find({course:course._id});
  await Promise.all(
    lectures.map(async(lecture)=>{
      await unlinkAsync(lecture.video);
      console.log(`Deleted video file: ${lecture.video}`);
    })
  )

  rm(course.image,()=>{
    console.log("Course image deleted successfully");
  });

  await Lecture.find({course:course._id}).deleteMany();
  await course.deleteOne();

  await  User.updateMany({},{$pull:{subscription:req.params._id}});
  res.json({
    message:"Course deleted successfully",
  });
});

export const getAllStats=TryCatch(async(req,res)=>{
  const totalCourses=(await Courses.find()).length;
  const totalLectures=(await Lecture.find()).length;
  const totalUsers=(await User.find()).length;

  const stats={
    totalCourses,
    totalLectures,
    totalUsers,

  };

  res.json({
    stats,
  })
});
