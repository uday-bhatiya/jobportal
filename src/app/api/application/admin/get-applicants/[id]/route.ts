import dbConnect from "@/lib/mongoose";
import ApplicationModel from "@/models/application.model";
import JobModel from "@/models/job.model";
import UserModel from "@/models/user.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest) {
    await dbConnect();
    if (!mongoose.models.Application) {
        mongoose.model("Application", ApplicationModel.schema);
    }
    if (!mongoose.models.User) {
        mongoose.model("User", UserModel.schema);
    }

    try {
        const applicantId = request.nextUrl.pathname.split('/').pop();
        
        const applicant = await ApplicationModel.findById(applicantId).sort({createdAt: -1}).populate({
            path: 'applicant',
        });
        if (!applicant) {
            return NextResponse.json({
                success: false,
                message: "No applicant found"
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: "Applicant fetched successfully",
            applicant
        }, { status: 200 })
        
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: "Failed to get applicants",
            error: error.message
        }, { status: 500 })
    }
}