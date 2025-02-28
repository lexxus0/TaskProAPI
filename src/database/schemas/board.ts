import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Board extends Document {
  @Prop({ required: true })
  name: string;

  @Prop()
  background: string;

  @Prop({ default: 'grid' })
  icon: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Column' }], default: [] })
  columns: Types.ObjectId[];
}

export const BoardSchema = SchemaFactory.createForClass(Board);
