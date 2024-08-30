import dbConnect from "@/lib/mongoose";
import CompanyModel from "@/models/company.model";
import JobModel from "@/models/job.model";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET(request:NextRequest) {
    await dbConnect(); 
    if (!mongoose.models.Company) {
        // This block of code fix the missing schema error
        mongoose.model("Company", CompanyModel.schema);
    }
    // console.log('Company Model Registered:', mongoose.modelNames().includes('Company'));

    try {
        const { searchParams } = new URL(request.url);
        console.log("Search Url", searchParams);

        const keyword = searchParams.get("keyword") || "";
        console.log(keyword)

        const query = {
            $or: [
             {title: { $regex: keyword, $options: "i"}},
             { description: { $regex: keyword, $options: "i" } },
            ]
        }
        console.log("Query", query);

        const jobs = await JobModel.find(query).populate("company")
        .populate({
            path: "company"
        }).sort( { createdAt: 1})
        console.log("JOBS", jobs)
        if (!jobs.length) {
            console.log("No Jobs found");
            return NextResponse.json({
                success: false,
                message: "No jobs found"
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: "Jobs fetched successfully",
            jobs
        }, { status: 200 })
        
    } catch (error: any) {
        console.log("Failed to get jobs", error);
        return NextResponse.json({
            success: false,
            message: "Failed to get jobs",
            error: error.message
        }, { status: 500 })
    }
}