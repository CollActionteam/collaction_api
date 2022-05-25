import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ _id: false, versionKey: false })
export class Country {
    @Prop({ required: true })
    readonly code: string;

    @Prop({ required: true })
    readonly name: string;
}
export const CountrySchema = SchemaFactory.createForClass(Country);
