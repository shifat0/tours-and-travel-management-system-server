const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv/config");

const api = process.env.API_URL;
const userRouter = require("./routers/users");
const eventRouter = require("./routers/events");
const errorHandler = require("./helpers/errorHandler");

// Middlewears
app.use(cors());
app.use(express.json());
app.options("*", cors());
app.use(morgan("tiny"));
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
app.use(errorHandler);

// Routers
app.use(`${api}/users`, userRouter);
app.use(`${api}/events`, eventRouter);

// Database Connection
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(api));
