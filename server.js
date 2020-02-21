const express = require("express");
const mongoose = require("mongoose");
const formidable = require("formidable");
const dotenv = require("dotenv");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const expressValidator = require("express-validator");
const braintree = require("braintree");
require("dotenv").config();
dotenv.config();

//route import
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const categoryRoutes = require("./routes/category");
const projectRoutes = require("./routes/project");
const braintreeRoutes = require("./routes/braintree");
// const orderRoutes = require("./routes/order");

//app
const app = express();

//db connection
mongoose
    .connect(process.env.DATABASE, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    .then(() => console.log("DB Connected"));

mongoose.connection.on("error", err => {
    console.log(`DB connection error: ${err.message}`);
});

//moggan middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(expressValidator());
app.use(cors());

//routes
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", projectRoutes);
app.use("/api", braintreeRoutes);
// app.use("/api", orderRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
