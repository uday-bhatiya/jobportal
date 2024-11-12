import dbConnect from "@/lib/mongoose";
import UserModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request:NextRequest) {
    await dbConnect();
    try {

        const  userId = request.nextUrl.pathname.split('/').pop();
        if (!userId) {
            return NextResponse.json({
                success: false,
                message: "User id is required",
            }, { status: 400 })
        }

        const user = await UserModel.findById(userId);
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "No user found",
            }, { status: 400 })
        }

        await UserModel.deleteOne({_id: userId});


        return NextResponse.json({
            suceess: true,
            message: "user deleted successfully"
        })
        
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: "Failed to user company",
            error: error.message
        }, { status: 401 })
    }
}