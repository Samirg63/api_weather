import express from 'express'
import cors from 'cors'
import { Request, Response } from 'express';

import { Mongo } from './db/mongo';

//routes
import authRouter from './routes/auth';
import userRouter from './routes/user';

async function main(){
    const hostname = 'localhost'
    const port = 2000;
    const app = express()

    app.use(express.json())
    app.use(cors())

    const db = await Mongo.connect()
    console.log(db)

    //Rotas
    app.use('/auth',authRouter)
    app.use('/user',userRouter)

    app.get('/',(req: Request, res:Response)=>{
        res.send('Hello world')
    })

    app.listen(port,()=>{
        console.log(`servidor rodando em ${hostname}:${port}`)
    })
}

main()