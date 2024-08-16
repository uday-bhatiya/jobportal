import mongoose, {Schema, Document, Model } from "mongoose";

export interface Job extends Document {
    title: string;
    description: string;
    requirements: string[];
    salary: string;
    experienceLevel: string;
    location: string;
    jobTitle: string;
    position: string;
    company: mongoose.Schema.Types.ObjectId;
    createdBy: mongoose.Schema.Types.ObjectId;
    applications: mongoose.Schema.Types.ObjectId[];
}

const JobSchema: Schema<Job> = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true
    },
    requirements: [{
        type: String,
    }],
    salary: {
        type: String,
        required: true
    },
    experienceLevel: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    jobTitle: {
        type: String,
        required: true
    },
    position: {
        type: String,
        required: true
    },
    company: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Company",
        required: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    applications: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
    }]
}, { timestamps: true })

const JobModel: Model<Job> = mongoose.models.Job || mongoose.model<Job>("Job", JobSchema);

export default JobModel;