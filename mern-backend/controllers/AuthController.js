const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Student = require("../models/Student");

// Register User
const register = async (req, res) => {
    try {
        const { name, email, password, role, standard, section } = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({ message: "Please fill all details", success: false });
        }

        const checkUser = await User.findOne({ email });
        if (checkUser) {
            return res.status(400).json({ message: "Email already exists", success: false });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });
        // If user is a student, create Student record
        if (role === "student") {
            if (!standard || !section) {
                return res.status(400).json({ message: "Standard and Section are required for students", success: false });
            }
            await Student.create({
                userId: user._id,
                standard,
                section
            });
        }
        const payload = { user: { id: user.id, role: user.role } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.status(201).json({ message: "User Registered", success: true });
    } catch (error) {
        console.error("Register Error:", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

// Login User
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "Invalid credentials", success: false });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials", success: false });
        }

        const payload = { user: { id: user.id, role: user.role } };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });

        res.cookie("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "development",
            sameSite: "strict",
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        return res.status(200).json({ message: `Welcome back ${user.name}`, success: true });
    } catch (error) {
        console.error("Login Error:", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

// Logout User
const logout = (req, res) => {
    res.clearCookie("token", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "development",
        sameSite: "strict",
    });

    return res.status(200).json({ message: "Logout successful", success: true });
};

// Get User Profile
const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found", success: false });
        }

        return res.status(200).json({ user, success: true });
    } catch (error) {
        console.error("Profile Error:", error);
        return res.status(500).json({ message: "Internal Server Error", success: false });
    }
};

module.exports = { register, login, logout, getUserProfile };
