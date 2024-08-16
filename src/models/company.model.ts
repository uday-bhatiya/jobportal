import mongoose, { Document, Schema, Model } from "mongoose";

export interface Company extends Document {
    name: string;
    description: string;
    website: string;
    location: string;
    logo: string;
    userId: mongoose.Schema.Types.ObjectId
}

const CompanySchema: Schema<Company> = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String
    },
    website: {
        type: String
    },
    location: {
        type: String
    },
    logo: {
        type: String // URL
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {timestamps: true})

const CompanyModel: Model<Company> = mongoose.models.Company || mongoose.model<Company>("Company", CompanySchema);

export default CompanyModel;