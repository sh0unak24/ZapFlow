import { loginSchema, signupSchema } from "../validators/auth.schema.js";
import z from "zod";
import { prisma } from "../lib/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
export const Signup = async (req, res) => {
    try {
        const parsedData = signupSchema.safeParse(req.body);
        if (!parsedData.success) {
            const pretty = z.prettifyError(parsedData.error);
            return res.status(400).json({
                message: "Validation error",
                errors: pretty
            });
        }
        const { email, name, password } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({
                message: "Please provide all the fields",
            });
        }
        const existingUser = await prisma.user.findUnique({
            where: {
                email
            }
        });
        if (existingUser) {
            return res.status(409).json({
                message: "User already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword
            }
        });
        if (!user) {
            return res.status(400).json({
                message: "Error in creating user"
            });
        }
        return res.status(201).json({
            message: "User created successfully",
            user: {
                id: user.id,
                email: user.email
            }
        });
    }
    catch {
        console.log("[SIGNUP-ERROR]");
        return res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
export const Login = async (req, res) => {
    try {
        const parsedData = loginSchema.safeParse(req.body);
        if (!parsedData.success) {
            return res.status(400).json({
                message: "Validation error",
                errors: z.prettifyError(parsedData.error),
            });
        }
        const { email, password } = parsedData.data;
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (!existingUser) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(401).json({
                message: "Invalid credentials",
            });
        }
        const token = jwt.sign({
            userId: existingUser.id,
            role: "USER",
        }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, {
            httpOnly: true,
            sameSite: "lax",
            secure: process.env.NODE_ENV === "production",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        return res.status(200).json({
            message: "Login successful",
            user: {
                id: existingUser.id,
                email: existingUser.email,
            },
        });
    }
    catch (err) {
        console.error("[LOGIN-ERROR]", err);
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};
