import dbConnect from "@/lib/mongoose";
import ApplicationModel from "@/models/application.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request:NextRequest) {
    await dbConnect();

    try {
        const { status } = await request.json();
        if (!status) {
            return NextResponse.json({
                success: false,
                message: "Status is required"
            }, { status: 404 })
        }

        const applicationId = request.nextUrl.pathname.split('/').pop();
        if (!applicationId) {
            return NextResponse.json({
                success: false,
                message: "application id is required"
            }, { status: 404 })
        }

        const application = await ApplicationModel.findById(applicationId);
        if (!application) {
            return NextResponse.json({
                success: false,
                message: "no application found"
            }, { status: 404 })
        }

        application.status = status.toLowerCase();
        await application.save();

        return NextResponse.json({
            success: true,
            message: "Status updated successfully",
            application
        }, { status: 201 })
        
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: "Failed to change status",
            error: error.message
        }, { status: 500 })
    }
}