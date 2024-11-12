import dbConnect from "@/lib/mongoose";
import UserModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest) {
    await dbConnect();

    try {

        const userId = request.nextUrl.pathname.split('/').pop();
        if (!userId) {
            console.log("User Id is required");
            return NextResponse.json({
                success: false,
                message: "User Id is required"
            }, { status: 400 })
        }

        const user = await UserModel.findById(userId);
        console.log(user)
        if (!user) {
            console.log("user not found");
            return NextResponse.json({
                success: false,
                message: "user not found"
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: "user found successfully",
            user
        }, { status: 200 })

        
    } catch (error: any) {
        console.log("Failed to get user", error);
        return NextResponse.json({
            success: false,
            message: "Failed to get user",
            error: error.message
        }, { status: 500 })
    }
}