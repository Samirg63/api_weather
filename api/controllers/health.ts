import type {IHealthFullResponse} from '../types/IHealthResponse'
import { Mongo } from '../db/mongo'
import dotenv from 'dotenv'
import { ok } from '../utils/httpResponse'

dotenv.config()

export class HealthController{
    async verify(){
        let response:IHealthFullResponse = {
            backend:{success:true},
            apis:[]
        }

        //Frontend verify
        
        await fetch(process.env.DOMAIN as string,{
            method:"GET"
        }).then(()=>{
            response = {
                ...response,
                frontend:{
                    success:true
                }
            }
        }).catch((e)=>{
            response = {
                ...response,
                frontend:{
                    success:false,
                    error:{
                        statusCode:503
                    }
                }
            }
        })

        //Database verify
        try {
            await Mongo.connect();
            response = {
                ...response,
                database:{
                    success:true
                }
            }
        } catch (error:unknown) {
            response = {
                ...response,
                database:{
                    success:false,
                    error:{
                        statusCode:(error as {status:number}).status || 503
                    }
                }
            }
        }
        
        //APIS
        
        
        //accuWeather

        try {
            const accuRequest = await fetch('https://dataservice.accuweather.com/currentconditions/v1/topcities/50',{
                method:'GET',
                headers: new Headers({
                    'Authorization': 'Bearer '+process.env.ACCUWEATHER_KEY as string
                })
            })
            const AccuResult = await accuRequest.json();

            //accuWeather only send a "status" when an error occurs
            if(AccuResult.status){
                throw {status:AccuResult.status}
            }



            response.apis!.push({
                accuweather:{
                    success:true
                }
            })
        } catch (e:any) {
            response.apis!.push({
                accuweather:{
                    success:false,
                    error:{
                        statusCode:e.status || 503
                    }
                }
            })
        }
        
        
        

        return ok(200,response);
    }
}