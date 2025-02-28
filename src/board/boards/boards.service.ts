import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { CreateBoardDto, UpdateBoardDto } from './boards.dto';
import { Board } from 'src/database/schemas/board';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryOptions } from 'mongoose';

@Injectable()
export class BoardsService {
  constructor(
    @InjectModel('Board') private readonly boardModel: Model<Board>,
  ) {}

  async findAll(): Promise<Board[] | null> {
    return this.boardModel.find();
  }

  async findById(id: string): Promise<Board | null> {
    return this.boardModel.findOne({ id }).exec();
  }

  async create(userId: string, createBoardDto: CreateBoardDto): Promise<Board> {
    const board = new this.boardModel({ ...createBoardDto, userId });
    return board.save();
  }

  async update(
    id: string,
    userId: string,
    updateBoardDto: UpdateBoardDto,
    options: QueryOptions = {},
  ): Promise<Board> {
    const updatedBoard = await this.boardModel.findOneAndUpdate(
      { _id: id, userId },
      updateBoardDto,
      {
        new: true,
        runValidators: true,
        ...options,
      },
    );

    if (!updatedBoard) {
      throw new HttpException('Board not found', HttpStatus.NOT_FOUND);
    }

    return updatedBoard;
  }

  async delete(id: string): Promise<null> {
    return this.boardModel.findOneAndDelete({ id });
  }
}
