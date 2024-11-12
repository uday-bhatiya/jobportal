import dbConnect from "@/lib/mongoose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from 'jsonwebtoken';
import UserModel from "@/models/user.model";
import JobModel from "@/models/job.model";

export async function POST(request: NextRequest) {
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
        const { title, description, requirements, salary, experienceLevel, location, jobType, position, company } = await request.json();

        if (!title || !description || !salary || !experienceLevel || !location || !jobType || !position || !company) {
            return NextResponse.json({
                success: false,
                message: "All fields are required"
            }, { status: 400 });
        }

        const newJob = await JobModel.create({
            title,
            description,
            requirements,
            salary,
            experienceLevel,
            location,
            jobType,
            position,
            company,
            createdBy: userId
        });

        return NextResponse.json({
            success: true,
            message: "Job posted successfully",
            newJob
        }, { status: 201 });

    } catch (error: any) {
        console.log("Failed to post job", error);
        return NextResponse.json({
            success: false,
            message: "Failed to post job",
            error: error.message
        }, { status: 500 });
    }
}