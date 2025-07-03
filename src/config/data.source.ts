import { ConfigModule, ConfigService } from "@nestjs/config";
import { DataSource, DataSourceOptions } from "typeorm";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";
import * as dotenv from 'dotenv';


const envFile = process.env.NODE_ENV ? `.${process.env.NODE_ENV}.env` : '.develop.env' //esto es para precargar la clave
dotenv.config({ path: envFile });  

ConfigModule.forRoot({
    envFilePath: `.${process.env.NODE_ENV}.env`,    
});

const configService = new ConfigService();

export const DataSourceConfig: DataSourceOptions = {
    type: 'postgres',
    host: configService.get('DB_HOST'),
    port: parseInt(configService.get('DB_PORT') || '5432', 10),//robusto
    username: configService.get('DB_USER'),
    password: configService.get('DB_PASSWORD'),
    database: configService.get('DB_NAME'),
    entities: [__dirname +'/../**/**/*.entity{.ts,.js}'],
    migrations: [__dirname +'/../migrations/*{.ts,.js}'],
    synchronize: false,
    migrationsRun: true,
    logging: false,
    namingStrategy: new SnakeNamingStrategy(),
};

const AppDS = new DataSource(DataSourceConfig);
export default AppDS;