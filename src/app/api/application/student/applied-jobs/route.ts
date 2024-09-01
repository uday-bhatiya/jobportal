import dbConnect from "@/lib/mongoose";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from 'jsonwebtoken';
import ApplicationModel from "@/models/application.model";
import CompanyModel from "@/models/company.model";
import JobModel from "@/models/job.model";
import mongoose from "mongoose";

interface DecodedToken extends JwtPayload {
    id?: string;
}

export async function GET(request: NextRequest) {
    await dbConnect();

    // Ensure models are connected properly
    if (!mongoose.models.Company) {
        mongoose.model("Company", CompanyModel.schema);
    }
    if (!mongoose.models.Job) {
        mongoose.model("Job", JobModel.schema);
    }

    try {
        const token = cookies().get('token')?.value;
        if (!token) {
            return NextResponse.json({
                success: false,
                message: "Token is missing"
            }, { status: 400 });
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

        // Fetch applications
        const applications = await ApplicationModel.find({ applicant: decodedToken.id })
            .sort({ createdAt: -1 })
            .populate({
                path: 'job',
                populate: {
                    path: 'company'
                }
            });

        if (!applications.length) {
            return NextResponse.json({
                success: false,
                message: "No applications found"
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "Applications fetched successfully",
            applications
        }, { status: 200 });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: "Failed to get applied jobs",
            error: error.message
        }, { status: 500 });
    }
}
