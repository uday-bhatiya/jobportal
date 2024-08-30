import dbConnect from "@/lib/mongoose";
import ApplicationModel from "@/models/application.model";
import JobModel from "@/models/job.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest) {
    await dbConnect();
    if (!mongoose.models.Application) {
        mongoose.model("Application", ApplicationModel.schema);
    }
    //console.log('Application Model Registered:', mongoose.modelNames().includes('Application'));

    try {
        const jobId = request.nextUrl.pathname.split('/').pop();
        // console.log("JOB ID", jobId);
         // Validate jobId
         if (!jobId || !mongoose.Types.ObjectId.isValid(jobId)) {
            console.log("Invalid or missing job ID");
            return NextResponse.json({
                success: false,
                message: "Valid job ID is required"
            }, { status: 400 });
        }

        const job = await JobModel.findById(jobId).populate("applications");

        if (!job) {
            // console.log("Job not found");
            return NextResponse.json({
                success: false,
                message: "Job not found"
            }, { status: 404 })
        }
        // console.log(job);

        return NextResponse.json({
            success: true,
            message: "Job found successfully",
            job
        }, { status: 200 })
        
    } catch (error: any) {
        // console.log("Failed to get job", error);
        return NextResponse.json({
            success: false,
            message: "Failed to get job",
            error: error.message
        }, { status: 500 })
    }
}