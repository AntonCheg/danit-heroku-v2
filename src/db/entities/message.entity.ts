import { Entity, Column, ManyToOne } from "typeorm";
import { TCreateMessage } from "types";
import { Base } from "./base.entity";
import { ChatEntity } from "./chat.entity";
import { UserEntity } from "./user.entity";

@Entity({ name: "messages" })
export class MessageEntity extends Base<TCreateMessage> {
  @Column()
  public data: string;

  @Column()
  public senderId: number;

  @Column()
  public chatId: number;

  @ManyToOne(() => UserEntity)
  public sender: Promise<UserEntity>;

  @ManyToOne(() => ChatEntity)
  public chat: Promise<ChatEntity>;
}
