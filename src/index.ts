import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import serverConfig from './config/server-config';
import { errorHandler } from './middlewares/errorHandler';

const app = express()

app.use(helmet())
app.use(express.json())
app.use(cors())


app.use(errorHandler)

app.listen(serverConfig.PORT,()=>{
    console.log(`Server is running on Port ${serverConfig.PORT}`)
})