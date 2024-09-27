import 'server-only'
import { JWTPayload, SignJWT, jwtVerify } from 'jose'
 
const secretKey = process.env.SESSION_SECRET
const encodedKey = new TextEncoder().encode(secretKey)
interface SessionPayload extends JWTPayload{
  id?:string,
  username?:string,
  email?:string,
  role?:string,
  iat?:number,
  exp?:number
}
export async function decrypt(session: string | undefined = ''):Promise<SessionPayload | null>{
    
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    })
    payload.id=payload.id as string
    return payload
  } catch (error) {
    return null
  }
}