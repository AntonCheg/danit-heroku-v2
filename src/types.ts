import { EnvEnum } from 'config';
import { Request } from 'express';
import { Socket } from 'socket.io';
import { BaseEntity } from 'typeorm';
import { ItemEntity } from './db/entities/item.entity';
import { UserEntity } from './db/entities/user.entity';
import { UserRoleEnum } from './enums/user-role.enum';
import { WsChatEventsEnum } from './enums/ws-chat.events.enum';

export interface IRequest extends Request {
  user: UserEntity;
}

export interface IEntityRequest<T extends BaseEntity> extends Request {
  user: UserEntity;

  entity: T;
}

export interface ISocketError extends Socket {
  err: Error;
}

export interface ISocket extends Omit<Socket, 'handshake'> {
  user?: UserEntity;

  event?: WsChatEventsEnum;

  handshake: { auth: { token?: string } };

  payload?: { chatId: number; message: string; messageId: number };
}

export interface JwtPayload {
  role: UserRoleEnum;

  id: number;

  login: string;
}

export type TUserSimple = Omit<UserEntity, 'password' | 'purchases' | 'items'> & {
  items?: ItemEntity[];
  purchases?: ItemEntity[];
};

export type TSocketMessage<T = IChatPayload> = {
  event: WsChatEventsEnum;

  payload: T;
};

export interface IChatPayload {
  userId: number;

  chatId: number;

  messageId: number;

  data: string;
}

export type TSendMessage = Omit<IChatPayload, 'messageId'>;

export type TDeleteMessage = Pick<IChatPayload, 'messageId'>;

export type TCreateMessage = {
  senderId: number;
  chatId: number;
  data: string;
};

export type TMessageEdit = Pick<IChatPayload, 'messageId' | 'data'>;

export type TSocketClient = Socket & { user: UserEntity };

export type IBroadcastMessagePayload = {
  userIds: number[];
  data: string;
};

export type TEnvConfig = Record<keyof typeof EnvEnum, any>;
export type JwtEncodePayload = JwtPayload | UserEntity;
export type TTokenEncode = { data: JwtEncodePayload; expiresIn: string | number };
