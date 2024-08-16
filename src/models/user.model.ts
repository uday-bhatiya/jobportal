import mongoose,{ Schema, Document, Model } from "mongoose";

interface UserProfile {
    bio?: string;
    skills?: string[];
    resume?: string; // URL
    resumeOriginalName?: string;
    company?: mongoose.Schema.Types.ObjectId;
    profilePhoto?: string;
}

export interface User extends Document {
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
    role: "student" | "recruiter";// Enum type
    profile: UserProfile

}

const UserProfileSchema: Schema = new Schema({
    bio: { type: String },
    skills: [{ type: String }],
    resume: { type: String }, // URL
    resumeOriginalName: { type: String },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company"
    },
    profilePhoto: {
        type: String,
        default: ""
    }
});

const UserSchema: Schema<User> = new Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ["student", "recruiter"],
        required: true
    },
    profile: UserProfileSchema // Use the profile schema here
}, {timestamps: true})

const UserModel: Model<User> = mongoose.models.User || mongoose.model<User>("User", UserSchema);

export default UserModel;