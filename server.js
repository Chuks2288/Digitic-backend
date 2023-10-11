import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import connectDB from "./config/dbConn.js";
import userRoute from "./routes/userRoute.js";
import productRoute from "./routes/productRoute.js";
import blogRoute from "./routes/blogRoute.js";
import prodCatRoute from "./routes/prodCatRoute.js";
import blogCatRoute from "./routes/blogCatRoute.js";
import brandRoute from "./routes/brandRoute.js";
import couponRoute from "./routes/couponRoute.js";
import { errorHandler, notFound } from "./middlewares/errorHandler.js";
const PORT = process.env.PORT || 4000;

//Initializing express app
const app = express();

//loading the Environment variables
dotenv.config();

// Connect to Mongodb
connectDB();

//middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/users", userRoute);
app.use("/api/products", productRoute);
app.use("/api/blogs", blogRoute);
app.use("/api/prodcategory", prodCatRoute);
app.use("/api/blogcategory", blogCatRoute);
app.use("/api/brands", brandRoute);
app.use("/api/coupons", couponRoute);

app.use(notFound);
app.use(errorHandler);

//connect to server
app.listen(PORT, () => {
  console.log(`server is running at PORT ${PORT}`);
});
