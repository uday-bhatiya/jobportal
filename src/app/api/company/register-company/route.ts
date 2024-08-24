import dbConnect from "@/lib/mongoose";
import CompanyModel from "@/models/company.model";
import { NextRequest, NextResponse } from "next/server";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import UserModel from "@/models/user.model";

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

        const { companyName } = await request.json();

        if (!companyName) {
            return NextResponse.json({
                success: false,
                message: "Company name is required"
            }, { status: 400 });
        }

        const existingCompany = await CompanyModel.findOne({ name: companyName });

        if (existingCompany) {
            return NextResponse.json({
                success: false,
                message: "Company already exists"
            }, { status: 409 });
        }

        const company = await CompanyModel.create({
            name: companyName,
            userId: user._id
        });

        return NextResponse.json({
            success: true,
            message: "Company registered successfully",
            company
        }, { status: 201 });

    } catch (error: any) {
        console.log("Error registering Company: ", error);

        return NextResponse.json({
            success: false,
            message: "Error registering Company",
            error: error.message
        }, { status: 500 });
    }
}
