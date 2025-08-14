export function ok(statusCode:number,body:any){
    return{
        status:statusCode,
        success:true,
        body:body
    }
}

export function httpError(statusCode:number,body:string){
    return{
        status:statusCode,
        success:false,
        body:body
    }
}