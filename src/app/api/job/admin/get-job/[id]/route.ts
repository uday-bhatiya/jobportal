import dbConnect from "@/lib/mongoose";
import ApplicationModel from "@/models/application.model";
import JobModel from "@/models/job.model";
import UserModel from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest) {
    await dbConnect();

    try {

        const jobId = request.nextUrl.pathname.split('/').pop();
        console.log(jobId)
        if (!jobId) {
            // console.log("Job Id is required");
            return NextResponse.json({
                success: false,
                message: "Job Id is required"
            }, { status: 400 })
        }

        const job = await JobModel.findById(jobId).populate("company") // Populate company details
        .populate({
            path: "applications",
            model: ApplicationModel,
            populate: {
                path: "applicant", // Populate applicant within each application
                model: UserModel // Make sure applicant references this model
            }
        });

        console.log(job)
        if (!job) {
            // console.log("job not found");
            return NextResponse.json({
                success: false,
                message: "job not found"
            }, { status: 404 })
        }
     

        return NextResponse.json({
            success: true,
            message: "job found successfully",
            job
        }, { status: 200 })

        
    } catch (error: any) {
        console.log("Failed to get job", error);
        return NextResponse.json({
            success: false,
            message: "Failed to get job",
            error: error.message
        }, { status: 500 })
    }
}