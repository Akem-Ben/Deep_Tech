import express, { NextFunction, Request, Response } from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import bodyParser from "body-parser";
import logger from "morgan";
import cookieParser from "cookie-parser";
import apiRouter from "./routes";
// import { PORT } from "./configurations";
import { createServer } from "http";
import { connectDB } from "./configurations/database";

const app = express();

const server = createServer(app);

// set security HTTP headers to disable 'powered by Express' header feature
app.disable("x-powered-by");

// set security HTTP headers
app.use(helmet());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// compress response to increase speed
app.use(compression());

//set cors
app.use(cors());


app.use(bodyParser.json());
app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());

//Database
connectDB()

//routes
app.use("/api", apiRouter);


//Health Check Endpoint
app.get("/", (request: Request, response: Response) => {
  response.send("Welcome to PlentyChat API 👋");
});


// Error handler
app.use(
  (error: Error, request: Request, response: Response, next: NextFunction) => {
    console.error(error.stack);
    response.status(500).send("Something broke!");
  },
);

/**
 * Server
 */
server.listen(3000, () => {
  console.log(`server running on Port ${3000}`);
});

export default app;
