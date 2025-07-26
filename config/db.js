import mongoose from "mongoose";

const connectDB = async () => {
  if (process.env.NODE_ENV === "test") return; // ⛔ Don't connect in test mode

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB connected");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

export default connectDB;
