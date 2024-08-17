import { NextRequest, NextResponse } from "next/server";

export async function GET(request:NextRequest) {
    try {
        const response = NextResponse.json({
            success: true,
            message: "Logout successfully"
        });
        
        response.cookies.set("token", "", {
            httpOnly: true,
            expires: new Date(0)
        });

        return response;
    } catch (error: any) {
        console.log("logout failed", error);
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 });
    }
}