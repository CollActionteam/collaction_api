import { MongoQueryRunner } from 'typeorm/driver/mongodb/MongoQueryRunner';
import { Collection } from 'typeorm/driver/mongodb/typings';
import { MigrationInterface } from 'typeorm/migration/MigrationInterface';

export abstract class BaseMigration implements MigrationInterface {
    name?: string | undefined;
    abstract up(queryRunner: MongoQueryRunner): Promise<any>;
    abstract down(queryRunner: MongoQueryRunner): Promise<any>;

    protected getDb(queryRunner: MongoQueryRunner) {
        return queryRunner.databaseConnection.db(queryRunner.connection.driver.database);
    }

    protected getCollection<T>(queryRunner: MongoQueryRunner, collectionName: string): Collection<T> {
        return this.getDb(queryRunner).collection(collectionName);
    }
}
