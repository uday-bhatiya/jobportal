import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const protectedRoutes = ['/api/user/logout','/api/company/register-company', '/api/company/get-company','/api/get-companies', '/api/job/admin/get-jobs', '/api/job/admin/post-job','/api/job/student/get-job','/api/job/student/get-jobs','/api/application/admin/application-status','/api/application/admin/get-applicants','/api/student/applied-jobs','/api/student/apply-for-job'];

    // Check if the request is to one of the protected routes
    if (protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
        // Get the token from the cookie
        const tokenCookie = request.cookies.get('token');
        const token = tokenCookie?.value;

        // If no token is found, return an unauthorized response
        if (!token) {
            return NextResponse.json({
                message: "Unauthorized: No token provided.",
                success: false
            }, { status: 401 });
        }
    }

    // If the route is not protected, just continue the request
    return NextResponse.next();
}

export const config = {
    matcher: ['/api/:path*'], // Matches all API routes
};
