const dotenv = require("dotenv");
dotenv.config();
const express = require("express")
const app = express();
const mongoose = require("mongoose");
const User = require("./models/User");
const db = require("./config/mongoose_connection");
const { urlencoded } = require("body-parser");
const cookieParser = require("cookie-parser")
const authRoute = require("./routes/authRoutes")
const studentRoute = require("./routes/studentRoutes")
const adminRoute = require("./routes/adminRoutes")
const seedRoute = require("./routes/seedRoutes");
const teacherRouter = require("./routes/teacherRoutes");
const cors = require('cors')

app.use(cors({ credentials: true, origin: "http://localhost:5173" }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/seed", seedRoute);
app.use("/api/v1/admin", adminRoute);
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/student", studentRoute);
app.use("/api/v1/teacher", teacherRouter);

app.listen(8000, () => {
    console.log(`server connected`)
})
