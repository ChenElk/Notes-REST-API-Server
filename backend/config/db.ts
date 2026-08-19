import mongoose from 'mongoose';

export const connectDB = async () => {
    const dbUri = process.env.MONGODB_CONNECTION_URL;
    if (!dbUri) {
        console.error("Error: MONGODB_CONNECTION_URL is not defined in .env file");
        process.exit(1);
    }

    try {
        await mongoose.connect(dbUri);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};