import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import serverConfig from './config/server-config';
import { errorHandler } from './middlewares/errorHandler';
import apiRouter from './routes/post-routes'
import { connectToDB } from './config/db-config';
import logger from './utils/logger';


const app = express()

app.use(helmet())
app.use(express.json())
app.use(cors())

app.use('/api',apiRouter)

app.use(errorHandler)

app.listen(serverConfig.PORT,async()=>{
    console.log(`Server is running on Port ${serverConfig.PORT}`)
    await connectToDB()
})

process.on("uncaughtException", (err) => {
  logger.error("UNCAUGHT EXCEPTION", err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  logger.error("UNHANDLED REJECTION", err);
});