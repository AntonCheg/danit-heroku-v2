import { RefreshToken } from 'db/entities/refresh-token.entity';
import { sign, verify } from 'jsonwebtoken';
import { pick } from 'lodash';
import { EnvConfig } from '../config';
import { UserEntity } from '../db/entities/user.entity';
import { JwtPayload } from '../types';
import ms from 'ms';

class JwtService {
  decode(token: string) {
    return verify(token, EnvConfig.SECRET_KEY) as JwtPayload;
  }

  encode(data: JwtPayload | UserEntity) {
    return sign(pick(data, 'login', 'id', 'role'), EnvConfig.SECRET_KEY, {
      expiresIn: '4h',
    });
  }

  encodeRefreshToken(data: string) {
    return sign(data, EnvConfig.SECRET_KEY, {
      expiresIn: '8h',
    });
  }

  decodeRefreshToken(data: string) {
    return verify(data, EnvConfig.SECRET_KEY);
  }

  updateRefreshTokenExpireDate(data: RefreshToken) {
    data.expireDate = Date.now() + ms('8h');
    data.save();
  }
}

export default new JwtService();
