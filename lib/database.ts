// src/lib/database.ts
import mongoose from "mongoose";

declare global {
  // eslint-disable-next-line no-var
  var mongoose: {
    conn: mongoose.Connection | null;
    promise: Promise<mongoose.Connection> | null;
  };
}

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

interface CachedConnection {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

let cached: CachedConnection = global.mongoose || { conn: null, promise: null };

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect(): Promise<mongoose.Connection> {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts: mongoose.ConnectOptions = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose.connection;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export type { CachedConnection };
export default dbConnect;

export async function dbDisconnect(): Promise<void> {
  if (cached.conn) {
    await cached.conn.close();
    cached.conn = null;
    cached.promise = null;
  }
}
