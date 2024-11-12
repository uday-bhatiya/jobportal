import dbConnect from "@/lib/mongoose";
import UserModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from 'bcryptjs';

export async function PUT(request:NextRequest) {
    await dbConnect();

    try {

        const { fullName, email, phoneNumber, password } = await request.json();
        if (!fullName || !email || !phoneNumber) {
            return NextResponse.json({
                success: false,
                message: "All fields except password are required"
            }, { status: 400 })
          }

          const user = await UserModel.findOne({email});
          if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
          }

          user.fullName = fullName;
          user.phoneNumber = phoneNumber;
          if (password) {
            const hashedPassword = await bcrypt.hash(password, 10);
            user.password = hashedPassword;
          }

          await user.save();

          return NextResponse.json({
            success: true,
            message: "Profile updated",
            user
          }, { status: 200 })
        
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: "Failed to update profile",
            error: error.message
        }, { status: 401 })
    }
}