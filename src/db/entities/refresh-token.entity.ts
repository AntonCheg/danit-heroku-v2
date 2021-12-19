import { Column, Entity } from 'typeorm';
import { Base } from './base.entity';

@Entity({ name: 'refresh_tokens' })
export class RefreshToken extends Base {
  @Column()
  token: string;
}
