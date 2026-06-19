export interface IHealthFullResponse{
    backend:IHealthResponse,
    frontend?:IHealthResponse,
    apis?:{[key:string]:IHealthResponse}[],
    database?:IHealthResponse
}

interface IHealthResponse{
    success:boolean,
    error?:{
        statusCode:number,
    }
}