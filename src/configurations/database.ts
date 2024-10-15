import mongoose from 'mongoose';
import { DATABASE_URI } from './envKeys';

let connection: typeof mongoose | null = null;

export const connectDB = async () => {
  if (connection) {
    return connection;
  }

  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => {
      reject(new Error('Database connection timeout. Please try again later.'));
    }, 10000)
  );

  const connect = mongoose.connect(`${DATABASE_URI}`)
    .then((conn) => {
      console.log('Database connected');
      connection = conn;
      return connection;
    })
    .catch((error) => {
      console.error('Error connecting to database:', error);
      throw error;
    });

  return Promise.race([connect, timeout]);
};
