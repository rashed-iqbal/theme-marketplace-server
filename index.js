// External imports
require("dotenv").config();
const express = require("express");
require("./middlewares/AsyncErrorHandler");
const cors = require("cors");
const app = express();
const allRoutes = require("./routes/index");

// Set Ejs View Engine
app.set("view engine", "ejs");

// Internal imports
const connection = require("./configs/database");
const ErrorHandler = require("./middlewares/ErrorHandler");

// Database connect
connection();

// Request parser
app.use(express.static("public"));
app.use(express.json());
app.use(cors());

//All Routes
app.use("/api", allRoutes);

// Api Route Error Handling
app.use(ErrorHandler({ log: true }));

// app listening
const port = process.env.PORT || 8080;
app.listen(port, console.log(`App is listening on port ${port}`));

// Error handle for unhandled rejection
process.on("unhandledRejection", (error) => {
    throw error;
});

process.on("uncaughtException", (error) => {
    console.log(error);
    process.exit(1);
});
