import {configDotenv} from 'dotenv'

configDotenv()

export default {
    PORT:process.env.PORT,
    NODE_ENV:process.env.NODE_ENV,
    DB_URL:process.env.DB_URL,
    REDIS_HOST:process.env.REDIS_HOST,
    REDIS_PORT:process.env.REDIS_PORT,
    REDIS_PASSWORD:process.env.REDIS_PASSWORD
}