import express from "express";
import colors from "colors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoDBConnect from "./config/db.js";
import corsOptions from "./config/corsSetup.js";
import errorHandler from "./middlewares/errorHandler.js";
import userRoute from "./routes/userRoutes.js";
import authRoute from "./routes/authRoutes.js";

// initialization
const app = express();
dotenv.config();

// set middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors(corsOptions));

app.use(express.static("public"));

// environment vars
const PORT = process.env.PORT || 5050;

// Multiple fields upload router

// routing
app.use("/api/v1/user", userRoute);
app.use("/api/v1/auth", authRoute);

// error handler
app.use(errorHandler);

// app listen
app.listen(PORT, () => {
  mongoDBConnect();
  console.log(`server is running on port ${PORT}`.bgBlue.black);
});
