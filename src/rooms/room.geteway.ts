import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { RoomsService } from './rooms.service';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class RoomGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly roomsService: RoomsService) {}

  @SubscribeMessage('join-room')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { code: string },
  ) {
    const room = this.roomsService.findByCode(payload.code);
    if (!room) {
      client.emit('room-error', { message: 'Room not found' });
      return;
    }
    client.join(room.code);
    console.log(`Client ${client.id} joined room ${room.code}`);

    client.emit('board-update', { board: room.board });
    client.emit('room-joined', {
      code: room.code,
      message: 'You have joined the room',
    });
  }

  @SubscribeMessage('toggle-number')
  handleToggleNumber(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { code: string; number: number },
  ) {
    const board = this.roomsService.toggleNumber(payload.code, payload.number);
    if (!board) {
      client.emit('room-error', { message: 'Room not found' });
      return;
    }
    this.server.to(payload.code).emit('board-update', { board });
  }

  @SubscribeMessage('reset-board')
  handleResetBoard(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { code: string },
  ) {
    const board = this.roomsService.resetBoard(payload.code);
    if (!board) {
      client.emit('room-error', { message: 'Room not found' });
      return;
    }
    this.server.to(payload.code).emit('board-update', { board });
  }
}
