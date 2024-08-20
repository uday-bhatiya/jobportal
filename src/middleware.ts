import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt, { JwtPayload } from 'jsonwebtoken';

export function middleware(request: NextRequest) {
    const protectedRoutes = ['/api/protected-route', '/another-protected-route'];

    if (protectedRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
        const authHeader = request.headers.get('Authorization');
        const token = authHeader?.split(' ')[1];

        if (!token) {
            return NextResponse.json({
                message: "Unauthorized: No token provided.",
                success: false
            }, { status: 401 });
        }

        try {
            const decoded = jwt.verify(token, process.env.SECRET_TOKEN!);

            // Type guard to check if decoded is a JwtPayload
            if (typeof decoded !== 'string' && 'id' in decoded) {
                request.headers.set('userId', decoded.id as string); // Attach the user ID to the request headers
            } else {
                return NextResponse.json({
                    message: "Unauthorized: Invalid token payload.",
                    success: false
                }, { status: 401 });
            }

            return NextResponse.next(); // Proceed to the requested route
        } catch (error) {
            return NextResponse.json({
                message: "Unauthorized: Invalid token.",
                success: false
            }, { status: 401 });
        }
    }

    return NextResponse.next(); // Proceed if the route is not protected
}

// Apply the middleware to all API routes or any specific routes you want
export const config = {
    matcher: ['/api/:path*'], // Matches all API routes
};
