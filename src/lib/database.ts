import mongoose from "mongoose";

const connectDatabase = async () => {
  try {
    const connection = await mongoose.connect(process.env.MONGODB_URI as string);
    if (process.env.NODE_ENV === "development") {
      console.log(`MongoDB Connected: ${connection.connection.host}`);
    }
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

export default connectDatabase;
