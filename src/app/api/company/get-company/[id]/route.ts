import dbConnect from "@/lib/mongoose";
import CompanyModel from "@/models/company.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest) {
    await dbConnect();

    try {

        const companyId = request.nextUrl.pathname.split('/').pop();
        console.log(companyId)
        if (!companyId) {
            console.log("Company Id is required");
            return NextResponse.json({
                success: false,
                message: "Company Id is required"
            }, { status: 400 })
        }

        const company = await CompanyModel.findById(companyId);
        console.log(company)
        if (!company) {
            console.log("Company not found");
            return NextResponse.json({
                success: false,
                message: "Company not found"
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            message: "Company found successfully",
            company
        }, { status: 200 })

        
    } catch (error: any) {
        console.log("Failed to get company", error);
        return NextResponse.json({
            success: false,
            message: "Failed to get company",
            error: error.message
        }, { status: 500 })
    }
}