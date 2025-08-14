import mongoose from "mongoose"
import dotenv from 'dotenv'

dotenv.config()

export const Mongo = {
    async connect(){
        // 
        try {
            const db = await mongoose.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dkhqvvx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`)
            this.db = db

            return 'Connected to mongo!'
        } catch (error) {
            return error
        }
    }
}