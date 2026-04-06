import express from "express";
import { UserController } from "../controllers/User";
import { httpError, ok } from "../utils/httpResponse";
const userRouter = express.Router();

const user = new UserController()

userRouter.put('/pins',async (req,res)=>{
    const data:{
        _id:string,
        pins:string[]
    } = req.body
    let result = await user.updatePins(data.pins,data._id)
    res.status(result.status).send(result)
})

userRouter.put('/home',async (req,res)=>{
    const data:{
        _id:string,
        home:string
    } = req.body

    let result = await user.updateHome(data.home,data._id)
    res.status(result.status).send(result)
})

userRouter.post('/findUser',async (req,res)=>{ 
    let result = await user.findUser(req.body);
    res.status(result.status).send(result)
})

userRouter.get('/token',async (req,res)=>{
    if(!req.query.token){
        res.send(httpError(400,"Missing Params"))
        return;
    }

    try {
        const data = await user.convertToken(req.query.token as string);
        res.send(ok(200,data))
    } catch (error:unknown) {
        res.send(httpError(400,error as string))
    }
})

export default userRouter