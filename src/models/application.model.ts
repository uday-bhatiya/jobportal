import mongoose, { Document, Schema, Model } from "mongoose";

export interface Applications extends Document {
    job: mongoose.Schema.Types.ObjectId;
    applicant: mongoose.Schema.Types.ObjectId;
    status: "pending" | "accepted" | "rejected";
}

const ApplicationSchema: Schema<Applications> = new Schema({
    job: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job",
        required: true,
    },
    applicant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"] as const,
        default: "pending",
    },
}, { timestamps: true });

const ApplicationModel: Model<Applications> = mongoose.models.Application || mongoose.model<Applications>("Application", ApplicationSchema);

export default ApplicationModel;