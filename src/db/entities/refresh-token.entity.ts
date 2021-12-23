import { Column, Entity } from 'typeorm';
import { Base } from './base.entity';


@Entity({ name: 'refresh_tokens' })
export class RefreshTokenEntity extends Base {
  @Column()
  public expiredDate: number;

  @Column()
  public token: string;
}
