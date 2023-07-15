import mongoose from "mongoose";

const mongoDBConnect = async () => {
  try {
    mongoose.connect(process.env.MONGO_STRING);
    console.log(`MongoDB Database is connected`.bgCyan.black);
  } catch (error) {
    console.log(error);
  }
};

export default mongoDBConnect;
