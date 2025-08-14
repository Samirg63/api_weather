import { userModel } from "../db/schemas/userSchema";
import { ObjectId } from "mongodb";
import { ok, httpError } from '../utils/httpResponse'

interface userData{
    username?:string,
    email?:string,
    password?:string | number
} 

export class UserController{

    static async getUserBy(method:string,data:string|number):Promise<userData | null>{
        let requestData:userData | null = await userModel.findOne({[method]:data})
        

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