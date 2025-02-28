import { MongooseModule } from '@nestjs/mongoose';
import { BoardSchema } from 'src/database/schemas/board';
import { CardSchema } from 'src/database/schemas/cards';
import { ColumnSchema } from 'src/database/schemas/column';
import { BoardsService } from './boards/boards.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Board', schema: BoardSchema },
      { name: 'Column', schema: ColumnSchema },
      { name: 'Card', schema: CardSchema },
    ]),
  ],
  providers: [BoardsService, ColumnService, CardService],
  controllers: [BoardController],
})
export class BoardModule {}
