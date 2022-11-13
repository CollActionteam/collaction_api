import { CrowdActionDocument } from "@infrastructure/mongo";
import slugify from "slugify";
import { MongoQueryRunner } from "typeorm/driver/mongodb/MongoQueryRunner";
import { BaseMigration } from "./util/base-migration";

export class addSlugs1668375001053 extends BaseMigration {

    public async up(queryRunner: MongoQueryRunner): Promise<void> {
        const crowdActionCollection = await this.getCollection<CrowdActionDocument>(queryRunner, 'crowdactions');
        crowdActionCollection.find({ slug: { $exists: false } }).forEach((doc: any) => {
          crowdActionCollection.updateOne({ _id: doc._id }, { $set: { slug: slugify(doc.title, { lower: true, strict: true }) } });
        });
    }

    public async down(queryRunner: MongoQueryRunner): Promise<void> {
        const crowdActions = await this.getCollection<CrowdActionDocument>(queryRunner, 'crowdactions');
        crowdActions.updateMany({ slug: { $exists: true } }, { $unset: { slug: '' } });
    }

}
