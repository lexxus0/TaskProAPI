import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Column extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Types.ObjectId, ref: 'Board', required: true })
  boardId: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Card' }], default: [] })
  cards: Types.ObjectId[];
}

export const ColumnSchema = SchemaFactory.createForClass(Column);
