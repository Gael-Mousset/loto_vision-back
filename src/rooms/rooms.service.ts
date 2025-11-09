import { Injectable } from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';

type Room = {
  id: string;
  code: string;
  board: boolean[];
  createdAt: Date;
};

@Injectable()
export class RoomsService {
  private rooms: Room[] = [];
  private id = Math.random();

  constructor() {
    console.log('RoomsService instance créée :', this.id);
  }

  createRoom(): Room {
    console.log('createRoom via instance :', this.id);
    const code = this.generateCode();
    const room: Room = {
      id: crypto.randomUUID(),
      code,
      board: new Array(90).fill(false),
      createdAt: new Date(),
    };
    this.rooms.push(room);
    return room;
  }

  findByCode(code: string): Room | undefined {
    console.log('findByCode via instance :', this.id, 'code =', code);
    return this.rooms.find((room) => room.code === code);
  }

  toggleNumber(code: string, number: number): boolean[] | undefined {
    console.log('toggleNumber via instance :', this.id);
    const room = this.findByCode(code);
    if (!room) return;

    const index = number - 1;
    if (index < 0 || index >= 90) return room.board;
    room.board[index] = !room.board[index];
    return room.board;
  }

  resetBoard(code: string): boolean[] | undefined {
    console.log('resetBoard via instance :', this.id);
    const room = this.findByCode(code);
    if (!room) return;

    room.board = new Array(90).fill(false);
    return room.board;
  }

  generateCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    return code;
  }
}
