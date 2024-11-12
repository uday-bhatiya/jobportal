import dbConnect from "@/lib/mongoose";
import ApplicationModel from "@/models/application.model";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(request: NextRequest) {
  await dbConnect();

  try {
    const { status } = await request.json();

    // Validate status
    const validStatuses = ['accepted', 'rejected', 'pending']; // Add valid statuses
    if (!status || !validStatuses.includes(status.toLowerCase())) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid status. Valid statuses are 'accepted', 'rejected', 'pending'.",
        },
        { status: 400 }
      );
    }

    const applicationId = request.nextUrl.pathname.split('/').pop();
    if (!applicationId) {
      return NextResponse.json(
        { success: false, message: "Application ID is required" },
        { status: 400 }
      );
    }

    const application = await ApplicationModel.findById(applicationId);
    if (!application) {
      return NextResponse.json(
        { success: false, message: "No application found" },
        { status: 404 }
      );
    }

    // Update the status
    application.status = status.toLowerCase();
    await application.save();

    return NextResponse.json(
      {
        success: true,
        message: "Status updated successfully",
        application,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "Failed to change status",
        error: error.message,
      },
      { status: 500 }
    );
  }
}