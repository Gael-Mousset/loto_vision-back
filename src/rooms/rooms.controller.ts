import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { JoinRoomDto } from './dto/join-room.dto';

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  createRoom() {
    const room = this.roomsService.createRoom();
    return { code: room.code, id: room.id };
  }

  @Post('join')
  joinRoom(@Body() dto: JoinRoomDto) {
    const room = this.roomsService.findByCode(dto.code);
    if (!room) {
      throw new Error('Room not found');
    }
    return { code: room.code, id: room.id };
  }
}
