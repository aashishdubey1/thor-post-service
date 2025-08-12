import { connectRabbitMQ } from "../config/rabbitMq-config";
import logger from "../utils/logger";


export class EventPublisher {

    static async publicEvent(message:any,routingKey:string,exchange_name:string){
        const channel = await connectRabbitMQ()
        channel?.publish(exchange_name,routingKey,Buffer.from(JSON.stringify(message)))
        logger.info(`Event is published : ${routingKey}`)
    }
        
    
}