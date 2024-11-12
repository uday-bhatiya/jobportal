import dbConnect from "@/lib/mongoose";
import CompanyModel from "@/models/company.model";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(request:NextRequest) {
    await dbConnect();
    try {

        const  companyId = request.nextUrl.pathname.split('/').pop();
        if (!companyId) {
            return NextResponse.json({
                success: false,
                message: "company id is required",
            }, { status: 400 })
        }

        const company = await CompanyModel.findById(companyId);
        if (!company) {
            return NextResponse.json({
                success: false,
                message: "No company found",
            }, { status: 400 })
        }

        await CompanyModel.deleteOne({_id: companyId});


        return NextResponse.json({
            suceess: true,
            message: "company deleted successfully"
        })
        
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: "Failed to delete company",
            error: error.message
        }, { status: 401 })
    }
}