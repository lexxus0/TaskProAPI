import { Body, Controller, Param, Post, Put, Req } from '@nestjs/common';
import { BoardsService } from './boards.service';
import { CreateBoardDto, UpdateBoardDto } from './boards.dto';

@Controller('boards')
export class BoardController {
  constructor(private readonly boardsService: BoardsService) {}

  @Post()
  async create(@Body() createBoardDto: CreateBoardDto, @Req() req) {
    const userId = req.user?.userId;
    return this.boardsService.create(userId, createBoardDto);
  }

  @Put()
  async update(
    @Param('boardId') boardId: string,
    @Body() updateBoardDto: UpdateBoardDto,
    @Req() req,
  ) {
    const userId = req.user?.userId;

    return this.boardsService.update(boardId, userId, updateBoardDto);
  }
}
