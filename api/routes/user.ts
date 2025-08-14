import express from "express";
import { UserController } from "../controllers/User";
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

export default userRouter