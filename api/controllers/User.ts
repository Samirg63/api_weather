import { userModel } from "../db/schemas/userSchema";
import { ObjectId } from "mongodb";
import { ok, httpError } from '../utils/httpResponse'
import { IAuthData } from "../utils/interfaces";
import  jwt  from "jsonwebtoken";

import dotenv from 'dotenv'
dotenv.config()

export class UserController{

    async convertToken(token:string){
        try {
            let data = jwt.verify(token,process.env.SECRET as string)
            return data;
        } catch (error) {
            throw error
        }
    }

    static async getUserBy(method:string,data:string|number):Promise<IAuthData | null>{
        let requestData:IAuthData | null = await userModel.findOne({[method]:data})
        return requestData;
    }

    static async addUser(data:{}){
        let request = await userModel.create(data)
        .then((response)=>{
            return response
        })
        .catch((e)=>{
            return false;
        })

        return request
    }

    async updatePins(pinArr:string[],userId:string){
        let request = await userModel.findOneAndUpdate({_id:new ObjectId(userId)},{pins:pinArr})
        .then((response)=>{
            if(response!._id){
                return ok(201,"pins updated")
            }else{
                return httpError(400,"something is wrong")
            }
        })
        .catch((e:any)=>{
            return httpError(400,"something is wrong")
        })

        return request
    }

    async updateHome(homeKey:string,userId:string){
        let request = await userModel.findOneAndUpdate({_id:new ObjectId(userId)},{home:homeKey})
        .then((response)=>{
            if(response!._id){
                return ok(201,"home updated")
            }else{
                return httpError(400,"something is wrong")
            }
        })
        .catch((e:any)=>{
            return httpError(400,"something is wrong")
        })

        return request
    }

    async findUser(params:object){
        
        let user = await userModel.findOne(params);
        return ok(200,user);
    }
}