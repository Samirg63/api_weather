export interface IAuthData{
    username?:string,
    email?:string,
    password?:string | number
}

export interface IUSerData{
   username:string,
   email:string,
   pins: string[],
   home:string
}