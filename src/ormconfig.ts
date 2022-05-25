import { basename } from 'path';
import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions';

const baseName: string = basename(__dirname);
const migrationsDir = `${baseName}/migration`;

const mongo: MongoConnectionOptions = {
    type: 'mongodb',
    url: process.env['MONGO_URL'],
    entities: [],
    subscribers: [],
    synchronize: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    logging: false,
    migrations: [`${migrationsDir}/!(*.draft).{ts,js}`],
    migrationsTableName: 'migrations',
    migrationsRun: false,
    cli: {
        migrationsDir,
    },
};

export = mongo;
