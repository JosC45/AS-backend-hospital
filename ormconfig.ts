import { ENTITIES } from "src/entities";
import { DataSource } from "typeorm";

export default new DataSource({
    type:'mysql',
    host: process.env.DB_HOST||'localhost',
    port: Number(process.env.DB_PORT)||3306,
    username: process.env.DB_USER ||'root',
    password: process.env.DB_PASSWORD||'12345',
    database: process.env.DB_NAME||'Hospital',
    entities: ENTITIES, 
    migrations: ['src/migrations/*.ts'],
    synchronize: true,
})