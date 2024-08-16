import dbConnect from "@/lib/mongoose";
import UserModel from "@/models/user.model";
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    await dbConnect();

    try {

        const {fullName, email, phoneNumber, password, role } = await request.json();

        if (!(fullName && email && phoneNumber && password && role)) {

            console.log("All fields are required")

            return Response.json({
                success: false,
                message: "All fields are required"
            }, { status: 400})
        }

        const existedUser = await UserModel.findOne({email});
        if (existedUser) {
            console.log("User already exist");
            
            return Response.json({
                success: false,
                message: "User already exist"
            }, { status: 400})
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new UserModel({
            fullName,
            email,
            phoneNumber,
            role,
            password: hashedPassword
        })

        await newUser.save();

        return Response.json({
            success: true,
            message: "User registered successfulyy",
            data: newUser
        }, { status: 201})


    } catch (error) {
        console.log("Error registering user: ", error);

        return Response.json(
            {
                success: false,
                message: "Error registering user"
            }, { status: 500 }
        )
    }
}