const express = require("express")
const app = express();
const mongoose = require("mongoose");
const User = require("./models/User");
const db = require("./config/mongoose_connection");
const { urlencoded } = require("body-parser");
const cookieParser = require("cookie-parser")
const authRoute = require("./routes/authRoutes")
const studentRoute = require("./routes/studentRoutes")
const dotenv = require("dotenv")
dotenv.config();

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", async (req, res) => {

    const user = await User.create({
        name: "Jenith",
        email: "jenith@gmail.com",
        password: "jenith",
        role: "student"
    })
    res.send("User Created")

})

app.use("/api/v1/auth", authRoute);
app.use("/api/v1/student", studentRoute);
app.listen(8000, () => {
    console.log(`server connected`)
})
