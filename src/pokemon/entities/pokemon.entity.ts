import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

//Lo extendemos de Dcument para tener las funcionalidades de mongoose
@Schema()
export class Pokemon extends Document {

    // id: string;// Este Id Mongo me lo da
    @Prop({
        unique: true,
        index: true,
    })
    name: string;

    @Prop({
        unique: true,
        index: true,
    })
    nro: number;
}

export const PokemonSchema = SchemaFactory.createForClass(Pokemon);
