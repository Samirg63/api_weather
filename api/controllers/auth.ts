import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

import { UserController } from './User'
import { ok, httpError } from '../utils/httpResponse'

interface userData{
    username?:string,
    email?:string,
    password?:string | number,
    _doc?:any,
    type?:'email' | 'google',
    home?:''
} 

interface googleUserData{
    email:string,
    username:string
}

interface dbResponse{
    status:number,
    success:boolean,
    body?:any,
    token?:string
}

dotenv.config()

export class authController{

    async register(data:userData):Promise<dbResponse>{
        //Verify if user already exists
        let user = await UserController.getUserBy('email',data.email!)
        if(user !== null){
            return httpError(400,'User already exists')
        }
        
        
        
        try {
            //hash password
            const salt = await bcrypt.genSalt(12)
            const hashedPass = await bcrypt.hash(String(data.password),salt)
            const userData:userData = {...data,password:hashedPass,type:'email',home:''}
            
            let User:any = await UserController.addUser(userData)
            let {password,...rest} = User._doc


            let secret:string|undefined = process.env.SECRET
            let token = jwt.sign({...rest},secret!)

            return {...ok(200,"Correct credentials!"),
                body:rest,
                token:token
            }
        } catch (error) {
            return httpError(400,error)
        }
    }

    async login(data:userData):Promise<dbResponse>{
        let user:userData | null = await UserController.getUserBy('email',data.email!)
        if(user === null){
            return httpError(400,"User don't exists")
        }

        try {
            if(await bcrypt.compare(String(data.password),String(user.password))){
                const {password,...rest} = user._doc
                let secret:string|undefined = process.env.SECRET
                let token = jwt.sign({...rest},secret!)
                return {...ok(200,"Correct credentials!"),
                    body:rest,
                    token:token
                }
            }else{
                return httpError(400,'wrong Credentials')
            }
            
        } catch (error) {
            return httpError(400,error)
        }
    }

    async googleRegister(data:googleUserData):Promise<dbResponse>{
        try {
            const userData:userData = {...data,type:'google',home:''}
            
            let User:any = await UserController.addUser(userData)
            let secret:string|undefined = process.env.SECRET
            let token = jwt.sign({...User._doc},secret!)

            return {...ok(200,"Correct credentials!"),
                body:User._doc,
                token:token
            }
        } catch (error) {
            return httpError(400,error)
        }
    }

    async googleLogin(data:googleUserData):Promise<dbResponse>{
        let user:userData | null = await UserController.getUserBy('email',data.email!)
        try {
            let secret:string|undefined = process.env.SECRET
            let token = jwt.sign({...user!._doc},secret!)
            return {...ok(200,"Correct credentials!"),
                body:user!._doc,
                token:token
            } 
        } catch (error) {
            return httpError(400,error)
        }
    }
}