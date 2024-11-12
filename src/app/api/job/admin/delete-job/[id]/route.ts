import dbConnect from "@/lib/mongoose";
import JobModel from "@/models/job.model";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request:NextRequest) {
    await dbConnect();
    try {

        const  jobId = request.nextUrl.pathname.split('/').pop();
        if (!jobId) {
            return NextResponse.json({
                success: false,
                message: "Job id is required",
            }, { status: 400 })
        }

        const job = await JobModel.findById(jobId);
        if (!job) {
            return NextResponse.json({
                success: false,
                message: "No job found",
            }, { status: 400 })
        }

        await JobModel.deleteOne({_id: jobId});

        return NextResponse.json({
            suceess: true,
            message: "Job deleted successfully"
        })
        
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: "Failed to delete job",
            error: error.message
        }, { status: 401 })
    }
}