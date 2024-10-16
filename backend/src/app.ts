import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import bodyParser from "body-parser";
import logger from "morgan";
import cookieParser from "cookie-parser";
import apiRouter from "./routes";
import dotenv from 'dotenv';
import { createServer } from "http";
import { connectDB } from "./configurations/database";
import { PORT } from './configurations/envKeys';
import { errorUtilities } from './utilities';

const app = express();

const server = createServer(app);

dotenv.config()

// Set security HTTP headers to disable 'powered by Express' header feature
app.disable("x-powered-by");

// Set security HTTP headers
app.use(helmet());

// Parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Compress response to increase speed
app.use(compression());

// Set Cors
app.use(cors());


app.use(bodyParser.json());
app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());

// Database
(async () => {
  try {
    await connectDB();
    console.log('Application is running...');
  } catch (error:any) {
    console.error('Failed to connect to database:', error.message);
    process.exit(1);
  }
})();

// Routes
app.use("/api", apiRouter);


// Health Check Endpoint
app.get("/", (request: Request, response: Response) => {
  response.send("Welcome to PlentyChat API 👋");
});


// Error handler
app.use(errorUtilities.globalErrorHandler);


/**
 * Server
 */
server.listen(PORT, () => {
  console.log(`server running on Port ${PORT}`);
});

export default app;
