import dbConnect from "@/lib/mongoose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from 'jsonwebtoken';
import UserModel from "@/models/user.model";
import JobModel from "@/models/job.model";
import mongoose from "mongoose";
import CompanyModel from "@/models/company.model";

export async function GET(request:NextRequest) {
    await dbConnect();
    if (!mongoose.models.Company) {
        // This block of code fix the missing schema error
        mongoose.model("Company", CompanyModel.schema);
    }
    // console.log('Company Model Registered:', mongoose.modelNames().includes('Company'));


    try {
        const token = cookies().get('token')?.value;
        if (!token) {
            return NextResponse.json({
                success: false,
                message: "No token provided"
            }, { status: 401 })
        }

        const decoded = jwt.verify(token, process.env.SECRET_TOKEN as string) as JwtPayload;
        if (!decoded) {
            return NextResponse.json({
                success: false,
                message: "Failed to decoded token"
            }, { status: 401 })
        }

        const user = await UserModel.findOne({
            email: decoded.email
        })
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 })
        }
        const userId = user._id;

        const jobs = await JobModel.find({ createdBy: userId }).populate("company")
        if (!jobs) {
            return NextResponse.json({
                success: false,
                message: "No jobs found",
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: "Jobs fetched succussfully",
            jobs
        }, { status: 200 })
        
    } catch (error:any) {
        console.log("Failed to fetch jobs");
        return NextResponse.json({
            success: false,
            message: "Failed to fetch jobs",
            error: error.message
        })
    }
}