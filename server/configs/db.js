import mongoose from "mongoose";

mongoose.set("strictQuery", true);

const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected successfully");
  });

  let mongodbURI = process.env.MONGODB_URI;
  const projectName = "resume-builder";

  if (!mongodbURI) {
    throw new Error("MONGODB_URI is not defined in environment variables");
  }

  const url = new URL(mongodbURI);
  url.pathname = `/${projectName}`;

  try {
    await mongoose.connect(url.toString(), {
      serverSelectionTimeoutMS: 10000,
    });
  } catch (error) {
    console.error("Error connecting to MongoDB:", error?.message || error);
    throw error;
  }
};

export default connectDB;