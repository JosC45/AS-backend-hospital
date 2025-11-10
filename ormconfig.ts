import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

dotenv.config();
const requiredEnvVars = [
    'DB_HOST',
    'DB_PORT',
    'DB_USERNAME',
    'DB_PASSWORD',
    'DB_DATABASE'
];

for (const varName of requiredEnvVars) {
    if (!process.env[varName]) {
        throw new Error(`Error de configuración: La variable de entorno requerida "${varName}" no está definida.`);
    }
}

export default new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT!, 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
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