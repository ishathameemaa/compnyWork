import mongoose from 'mongoose';

const dbConnect = async (collections) => {
    if (mongoose.connections[0].readyState) {
        console.log("Already Connected");
        return;
    }
    const db = `${process.env.MONGODB_URI}${collections}`
    await mongoose.connect(db);
    console.log("DB Connected");
};
 
export default dbConnect;
