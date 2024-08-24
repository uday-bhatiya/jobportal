import dbConnect from "@/lib/mongoose";
import CompanyModel from "@/models/company.model";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt, {JwtPayload} from 'jsonwebtoken';
import UserModel from "@/models/user.model";

export async function GET(request :NextRequest) {
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

        const userId = user._id

        const companies = await CompanyModel.find({userId});
        if (!companies || companies.length === 0) {
            console.log("Companies not found");
            return NextResponse.json({
                message: "Companies not found",
                success: false
            }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            message: "companies fetch successfully",
            companies
        })
        
    } catch (error: any) {
        console.log("Failed to get company");
        return NextResponse.json({
            success: false,
            message: "Failed to get company",
            error: error.message
        }, { status: 500 })
    }
}