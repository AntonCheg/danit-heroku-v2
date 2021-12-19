import { sign, verify } from 'jsonwebtoken';
import { pick } from 'lodash';
import { EnvConfig } from '../config';
import { JwtEncodePayload, JwtPayload, TTokenEncode } from '../types';

class JwtService {
  decode(token: string) {
    return verify(token, EnvConfig.SECRET_KEY) as JwtPayload;
  }

  generateRefreshToken(data: JwtEncodePayload) {
    return this.encode({ data, expiresIn: '8h' });
  }

  generateAccessToken(data: JwtEncodePayload) {
    return this.encode({ data, expiresIn: '15m' });
  }

  encode(payload: TTokenEncode) {
    const { data, expiresIn } = payload;
    return sign(pick(data, 'login', 'id', 'role'), EnvConfig.SECRET_KEY, {
      expiresIn,
    });
  }
}

export default new JwtService();
