import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import hpp from "hpp";
import cookieParser from "cookie-parser";

import AppError from "./utils/appError.js";
import globalErrorHandler from "./controllers/errorController.js";
import facultyRouter from "./routes/facultyRoutes.js";
import departmentRouter from "./routes/departmentRoutes.js";
import optionRouter from "./routes/optionRoutes.js";
import programRouter from "./routes/programRoutes.js";
import noticeRouter from "./routes/noticeRoutes.js";
import messageRouter from "./routes/messageRoutes.js";

const app = express();

// Allow remote access
//const corsOptions = {
//  origin: process.env.API_URL_LOCAL,
//  credentials:true,
//  optionSuccessStatus:200
//};
app.use(cors());

// 1) GLOBAL MIDDLEWARES
// Serving static files
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.use("/public", express.static(path.join(__dirname, "public")));

// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
//app.use("/api", limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// 3) ROUTES
app.use("/api/v1/faculties", facultyRouter);
app.use("/api/v1/departments", departmentRouter);
app.use("/api/v1/options", optionRouter);
app.use("/api/v1/programs", programRouter);
app.use("/api/v1/notices", noticeRouter);
app.use("/api/v1/messages", messageRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

export default app;
