import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false);
    const conn = await mongoose.connect(process.env.MONGODB_URI!);
    console.log(`[database]: Connected to MongoDB - ${conn.connection.host}`);
  } catch (error) {
    console.error("Error connecting to MongoDB", error);
  }
};

export default connectDB;