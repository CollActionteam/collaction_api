import { basename } from 'path';
import { DataSource } from 'typeorm';

const baseName: string = basename(__dirname);
const migrationsDir = `${baseName}/migrations`;

export const dataSource = new DataSource({
    type: 'mongodb',
    url: process.env['MONGO_URL'],
    entities: [],
    subscribers: [],
    synchronize: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    logging: true,
    migrations: [`${migrationsDir}/!(*.draft).{ts,js}`],
    migrationsTableName: 'migrations',
    migrationsRun: false,
});
