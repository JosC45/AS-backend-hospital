import { ENTITIES } from "src/entities";
import { DataSource } from "typeorm";
import * as dotenv from 'dotenv';
dotenv.config();

export default new DataSource({
    type:'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER ,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: ENTITIES, 
    migrations: ['src/migrations/*.ts'],
    synchronize: true,
})