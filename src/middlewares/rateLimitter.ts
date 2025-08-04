
import {rateLimit} from 'express-rate-limit'
import {RedisStore} from 'rate-limit-redis'
import redis from '../config/redis-config'
import { Request, Response} from 'express'
import logger from '../utils/logger'
import type { RedisReply } from 'rate-limit-redis'

const sendCommand = ((...args: string[]): Promise<RedisReply> => {
  return redis.call(args[0]!, ...args.slice(1)) as Promise<RedisReply>
})

const generalLimiter = rateLimit({
  windowMs:15*60*1000,
  limit:100,
  standardHeaders:"draft-8",
  legacyHeaders:false,
  ipv6Subnet: 56,
  message:"Request limit is reached, try again in some time",
  store: new RedisStore({
    sendCommand: sendCommand,
    prefix:"general_rl",
  }),
  handler: (req: Request, res: Response) => {
    logger.warn(`Rate limit reached for IP: ${req.ip}`)
    res.status(429).json({success:false,message:"Too many requests"})
  }
})


const strictLimiter =  rateLimit({
  windowMs:15*60*1000,
  limit:10,
  standardHeaders:"draft-8",
  legacyHeaders:false,
  ipv6Subnet:56,
  // skipSuccessfulRequests:true,
  handler:(req:Request,res:Response)=>{
    logger.warn(`Rate limit reached for IP: ${req.ip}`) 
    res.status(429).json({success:false,message:"Too many requests"})
  },
  store:new RedisStore({
    sendCommand:sendCommand,
    prefix:"auth_rl"
  })
})


export {
  strictLimiter,
  generalLimiter
}