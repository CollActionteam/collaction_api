import { CrowdActionDocument } from "@infrastructure/mongo";
import slugify from "slugify";
import { MongoQueryRunner } from "typeorm/driver/mongodb/MongoQueryRunner";
import { Collection } from "typeorm/driver/mongodb/typings";
import { BaseMigration } from "./util/base-migration";

export class addSlugs1668375001053 extends BaseMigration {

    public async up(queryRunner: MongoQueryRunner): Promise<void> {
        const crowdActionCollection: Collection<CrowdActionDocument> = await this.getCollection<CrowdActionDocument>(queryRunner, 'crowdactions');
        const crowdActions = await crowdActionCollection.find<CrowdActionDocument>({ slug: { $exists: false } }).toArray();
        crowdActions.map(async crowdAction => await crowdActionCollection.updateOne({ _id: crowdAction._id }, { $set: { slug: slugify(crowdAction.title, { lower: true, strict: true}) } }));
    }

    public async down(queryRunner: MongoQueryRunner): Promise<void> {
        const crowdActions = await this.getCollection<CrowdActionDocument>(queryRunner, 'crowdactions');
        crowdActions.updateMany({ slug: { $exists: true } }, { $unset: { slug: '' } });
    }

}
