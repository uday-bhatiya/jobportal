import dbConnect from "@/lib/mongoose";
import UserModel from "@/models/user.model";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest) {
    await dbConnect();
    // console.log("in route")
    try {

        const token = cookies().get('token')?.value;
        if (!token) {
            return NextResponse.json({
                success: false,
                message: "No token provided"
            }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.SECRET_TOKEN as string) as JwtPayload;
        const user = await UserModel.findOne({ email: decoded.email }).select("-password");
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "User fetched succussfully",
            user
        }, { status: 200 })
        
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: "Failed fetching user",
            error: error.message
        }, { status: 404 })
    }
}