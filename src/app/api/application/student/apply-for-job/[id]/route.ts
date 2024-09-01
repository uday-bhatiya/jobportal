import dbConnect from "@/lib/mongoose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from 'jsonwebtoken'
import ApplicationModel from "@/models/application.model";
import JobModel from "@/models/job.model";

interface DecodedToken extends JwtPayload {
    id?:string
}

export async function GET(request:NextRequest) {
    await dbConnect();

    try {
        const jobId = request.nextUrl.pathname.split('/').pop();
        if (!jobId) {
            return NextResponse.json({
                success: false,
                message: "Job id is required"
            }, { status: 400 })
        }

        const token = cookies().get('token')?.value;
        if (!token) {
            return NextResponse.json({
                success: false,
                message: "Invalid token"
            }, { status: 401 })
        }

        // Verify and decode the JWT token
        let decodedToken: DecodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.SECRET_TOKEN as string) as DecodedToken;
        } catch (error) {
            return NextResponse.json({
                success: false,
                message: "Invalid or expired token"
            }, { status: 401 });
        }

        const job = await JobModel.findById(jobId);
        if (!job) {
            return NextResponse.json({
                success: false,
                message: "No job found"
            }, { status: 401 })
        }

        const existingApplication = await ApplicationModel.findOne({
            job: jobId,
            applicant: decodedToken.id
        });
        if (existingApplication) {
            return NextResponse.json({
                success: false,
                message: "You have already applied for this job"
            }, { status: 401 })
        }

        const newApplication = await ApplicationModel.create({
            job: jobId,
            applicant: decodedToken.id
        })
        // console.log(newApplication)
        job.applications.push(newApplication.id)
        // console.log(newApplication.id)
        // console.log(newApplication._id)
        await job.save();
        
        return NextResponse.json({
            success: true,
            message: "Succussfully applied for job"
        }, { status: 201 })

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: "Failed to applying job",
            error: error.message
        }, { status: 500 })
    }
}