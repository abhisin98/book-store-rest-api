import mongoose from "mongoose";
export * from "./books.model";

// --------------------------------------------------------------------
async function connectDB(): Promise<void> {
  if (!process.env.DATABASE_URI) {
    throw new Error("Please add your DATABASE_URI in the .env file.");
  }

  if (!process.env.DB_NAME) {
    throw new Error("Please add your DB_NAME in the .env file.");
  }

  return mongoose
    .connect(process.env.DATABASE_URI, {
      dbName: process.env.DB_NAME,
    })
    .then(() => {
      console.log("✅ Mongoose connected successfully");
      return;
    })
    .catch((error) => {
      console.error("❌ Mongoose connection failed:", error);
    });
}

async function closeDB(): Promise<void> {
  return mongoose.connection
    .close()
    .then(() => {
      console.log("✅ Mongoose connection closed.");
      return;
    })
    .catch((error) => {
      console.error("❌ Error closing Mongoose connection:", error);
    });
}

async function disconnectDB(): Promise<void> {
  return mongoose
    .disconnect()
    .then((res) => {
      console.log("✅ Mongoose disconnected from the database.");
      return;
    })
    .catch((error) => {
      console.error("❌ Error disconnecting Mongoose:", error);
    });
}

// --------------------------------------------------------------------
export { connectDB, closeDB, disconnectDB };
