import mongoose from 'mongoose';

const dbConnect = async () => {
    if (mongoose.connections[0].readyState) {
        console.log("Already Connected");
        return;
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB Connected");
};
 
export default dbConnect;
