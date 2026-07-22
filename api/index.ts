import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { Request, Response } from 'express';
import { Mongo } from './db/mongo';

//routes
import authRouter from './routes/auth';
import userRouter from './routes/user';
import { HealthController } from './controllers/health';


dotenv.config()

async function main(){
    const hostname = 'localhost'
    const port = 2000;
    const app = express()
    const health = new HealthController();
    

    app.use(express.json())
    app.use(cors({
        origin:process.env.DOMAIN
    }))

    await Mongo.connect()

    //Rotas
    app.use('/auth',authRouter)
    app.use('/user',userRouter)

    app.get('/',(req: Request, res:Response)=>{
        res.send('Hello world')
    })

    //Health check

    app.get('/health',async (req: Request, res:Response)=>{
        try {
            let response = await health.verify();
            res.status(response.status).send(response.body)
        } catch (error) {
            res.status(200).send({
                backend:{
                    success:false
                }
            })
        }
    })

    app.listen(port,()=>{
        console.log(`servidor rodando em ${hostname}:${port}`)
    })
}

main()