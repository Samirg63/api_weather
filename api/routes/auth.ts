import express from "express";
import { authController } from "../controllers/auth";
const authRouter = express.Router();

const auth = new authController()

interface registerData{
    username?:string,
    password?:string | string,
    confirmPassword?:string | string
    email?:string,
}

interface googleData{
    username:string,
    email:string
}

interface loginData{
    email?:string,
    password?:string | string
}
authRouter.post('/register',async (req,res)=>{

    const data:registerData = req.body

    switch (true) {
        case !data.username:
            res.status(403).send('Username is required')
            break;
        case !data.password:
            res.status(403).send('Password is required')
            break
        case !data.email:
            res.status(403).send('Email is required')
            break
        case data.password !== data.confirmPassword:
            res.status(403).send("Passwords don't match")
            break
        default:
            delete data.confirmPassword   
            const result = await auth.register(data)  
            res.status(result.status).send(result)
            break;
    }
})

authRouter.post('/login',async (req,res)=>{

    const data:loginData = req.body

    switch (true) {
        case !data.password:
            res.status(403).send('Password is required')
            break;

        case !data.email:
            res.status(403).send('Email is required')
            break;
    
        default:
            const result = await auth.login(data)
            res.status(result!.status).send(result)
            break;
    }
})

authRouter.post('/google/register',async (req,res)=>{
    const data:googleData = req.body 
    const result = await auth.googleRegister(data)     
    res.status(result.status).send(result) 
})

authRouter.post('/google/login',async (req,res)=>{
    const data:googleData = req.body 
    const result = await auth.googleLogin(data)  
    res.status(result!.status).send(result) 
})

export default authRouter