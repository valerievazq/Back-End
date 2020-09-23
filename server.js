const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const restricted = require("./middleware/restricted");
const storiesRouter = require("./stories/router");
const userRouter = require("./users/router");
dotenv.config();

const server = express();

server.use(helmet());
server.use(cors());
server.use(express.json());

server.use("/stories", storiesRouter);
server.use("/users", restricted, userRouter);

module.exports = server;
