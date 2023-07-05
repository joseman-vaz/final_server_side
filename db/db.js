// mongoose
//   .set("strictQuery", true)
//   .connect(MONGODB_URL)
//   .then((x) => {
//     const dbName = x.connections[0].name;
//     console.log(`Connected to Mongo! Database name: "${dbName}"`);
//   })
//   .catch((err) => {
//     console.error("Error connecting to MongoDB: ", err);
//   });

// export default mongoose;

import mongoose from "mongoose";

const MONGODB_URL =
  process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/final-project";

const connectDB = () => {
  mongoose.set("strictQuery", true);
  mongoose
    .connect(MONGODB_URL)
    .then(() => console.log("connected to mongo"))
    .catch((err) => {
      console.error("failed to connect with mongo");
      console.error(err);
    });
};

connectDB();
