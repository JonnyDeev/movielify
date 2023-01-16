const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const dotenv = require("dotenv");
const routes = require("./routes");
const connectDB = require("./db");
const app = express();
const port = 3000;

dotenv.config()
connectDB()

//MIDDLEWARES
app.use(express.json());
app.use(routes);
app.use(cors());
app.use(morgan("dev"));


//SERVER
app.listen(port, () => console.log(` App listening on port ${port}!`));
