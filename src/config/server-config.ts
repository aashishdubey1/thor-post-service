import {configDotenv} from 'dotenv'

configDotenv()

export default {
    PORT:process.env.PORT,
    NODE_ENV:process.env.NODE_ENV,
    DB_URL:process.env.DB_URL
}