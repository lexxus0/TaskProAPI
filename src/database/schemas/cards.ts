import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

@Schema()
export class Card extends Document {
  @Prop({ required: true })
  title: string;

  @Prop()
  description: string;

  @Prop({ enum: ['low', 'medium', 'high', 'without'], default: 'without' })
  priority: string;

  @Prop()
  deadline: Date;

  @Prop({ type: Types.ObjectId, ref: 'Column', required: true })
  columnId: Types.ObjectId;
}

export const CardSchema = SchemaFactory.createForClass(Card);
