import mongoose, { connections } from "mongoose";

type connectionObject = {
    isConnected?: number
}

const connection: connectionObject = {}

const dbConnect = async () : Promise<void> => {
    if (connection.isConnected) {
        console.log("Database already connected");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || "");
        connection.isConnected = db.connections[0].readyState;
        console.log("Database connected");
        
    } catch (error) {
        console.log("Database connection failed", error);
        process.exit(1);
    }
}

export default dbConnect;