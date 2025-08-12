import amqp from 'amqplib'
import logger from '../utils/logger';
import serverConfig from './server-config';

let connection = null;
let channel = null;

export const EXCHANGE_NAME = "social-app"

export async function connectRabbitMQ() {
    try {
        connection = await amqp.connect(serverConfig.RABBITMQ_URL!)
        channel = await connection.createChannel()

        await channel.assertExchange(EXCHANGE_NAME,'topic',{durable:false})
        logger.info("Connected to rabbitMQ")
        
        return channel


    } catch (error) {
        logger.error("Error connecting to rabbitmq",error)
    }
}
