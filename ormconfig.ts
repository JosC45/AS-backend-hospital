
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();

const requiredEnvVars = ['DB_HOST', 'DB_PORT', 'DB_USER', 'DB_PASSWORD', 'DB_NAME'];

for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
        throw new Error(`Error de configuración: La variable de entorno requerida "${varName}" no está definida.`);
    }
}

export default new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!, 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    entities: [__dirname + '/**/*.entity{.ts,.js}'],
    synchronize: false,
    migrations: [__dirname + '/migrations/*{.ts,.js}'],
    
    ssl: true, 
    extra: {
        ssl: {
            rejectUnauthorized: false
        }
    }
});