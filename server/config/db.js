import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");
    console.log(
      "Active MongoDB database:",
      mongoose.connection.db.databaseName,
    );
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

export default connectDB;
