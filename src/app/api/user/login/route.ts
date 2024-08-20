import dbConnect from "@/lib/mongoose";
import UserModel from "@/models/user.model";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    await dbConnect();

    try {
        const { email, password, role } = await request.json();

        if (!(email && password && role)) {
            console.log("All fields are required");
            return NextResponse.json({
                success: false,
                message: "All fields are required"
            }, { status: 400 });
        }

        const user = await UserModel.findOne({ email });
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User does not exist with this email"
            }, { status: 401 });
        }

        if (role !== user.role) {
            return NextResponse.json({
                success: false,
                message: "Invalid Role"
            }, { status: 401 });
        }

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return NextResponse.json({
                success: false,
                message: "Invalid password"
            }, { status: 401 });
        }

        const tokenData = {
            id: user._id?.toString(),
            email: user.email,
            role: user.role
        };

        const token = jwt.sign(tokenData, process.env.SECRET_TOKEN!, { expiresIn: "1d" });

        const response = NextResponse.json({
            success: true,
            message: "User logged in successfully"
        }, { status: 200 });

        response.cookies.set("token", token, {
            httpOnly: true,
            secure: true
        });

        return response;

    } catch (error: any) {
        console.log("Login failed", error);
        return NextResponse.json({
            success: false,
            message: "Login failed",
            error: error.message
        }, { status: 500 });
    }
}