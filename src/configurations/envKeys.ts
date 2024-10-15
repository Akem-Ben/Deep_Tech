import dotenv from 'dotenv';

dotenv.config()

export const APP_SECRET = process.env.APP_SECRET!
export const DATABASE_URI = process.env.DATABASE_URI!
export const PORT = process.env.PORT
export const GMAIL_USER = process.env.GMAIL_USER!
export const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD!
export const APP_BASE_URL = process.env.APP_BASE_URL!