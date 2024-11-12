import dbConnect from "@/lib/mongoose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from 'jsonwebtoken';
import UserModel from "@/models/user.model";
import JobModel from "@/models/job.model";
import { ObjectId } from "mongodb";


export async function PATCH(request: NextRequest) {
    await dbConnect();

    try {
        const token = cookies().get('token')?.value;

        if (!token) {
            return NextResponse.json({
                success: false,
                message: "No token provided"
            }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.SECRET_TOKEN as string) as JwtPayload;
        const user = await UserModel.findOne({ email: decoded.email });

        if (!user) {
            return NextResponse.json({
                success: false,
                message: "User not found"
            }, { status: 404 });
        }

        const userId = user._id;
        const { jobId, title, description, requirements, salary, experienceLevel, location, jobType, position } = await request.json();

        if (!jobId) {
            return NextResponse.json({
                success: false,
                message: "Job ID is required"
            }, { status: 400 });
        }

        // Verify that the user is the creator of the job
        const job = await JobModel.findOne({ _id: jobId, createdBy: userId });
        
        if (!job) {
            return NextResponse.json({
                success: false,
                message: "Job not found or you're not authorized to update it"
            }, { status: 404 });
        }

        // Update job fields that are provided in the request
        const updatedJob = await JobModel.findByIdAndUpdate(
            jobId,
            {
                ...(title && { title }),
                ...(description && { description }),
                ...(requirements && { requirements }),
                ...(salary && { salary }),
                ...(experienceLevel && { experienceLevel }),
                ...(location && { location }),
                ...(jobType && { jobType }),
                ...(position && { position }),
            },
            { new: true } // Return the updated job document
        );

        return NextResponse.json({
            success: true,
            message: "Job updated successfully",
            updatedJob
        }, { status: 200 });

    } catch (error: any) {
        console.log("Failed to update job", error);
        return NextResponse.json({
            success: false,
            message: "Failed to update job",
            error: error.message
        }, { status: 500 });
    }
}
