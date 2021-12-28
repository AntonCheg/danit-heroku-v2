import { RefreshToken } from './../../db/entities/refresh-token.entity';
import { Request, Response } from 'express';
import { assign, pick } from 'lodash';
import { UserEntity } from '../../db/entities/user.entity';
import JwtService from '../../services/jwt.service';
import { wrapper } from '../../tools/wrapper.helpers';
import { HttpError } from '../../common/errors';

export const registration = wrapper(async (req: Request, res: Response) => {
  const data = pick(req.body, 'login', 'password', 'role');

  const isLoginInUse = !!(await UserEntity.findOne({ login: data.login }));

  if (isLoginInUse) {
    throw new HttpError('Aaaa');
  }

  const user = new UserEntity();
  assign(user, data);

  await user.save();
  res.status(201).send(`User with id ${user.id} created!`);
});

export const login = async (req: Request, res: Response) => {
  const { password, login } = pick(req.body, 'password', 'login');
  const user = await UserEntity.findOne(
    { login },
    { select: ['password', 'id', 'role', 'login'] }
  );

  if (!user || !user.verifyPassword(password)) {
    return res.status(400).send('I dont know you bro');
  }

  const token = JwtService.encode(user);
  const refreshToken = new RefreshToken();
  refreshToken.token = JwtService.encodeRefreshToken(token);
  await JwtService.updateRefreshTokenExpireDate(refreshToken);

  return res.send({ token, refreshToken: refreshToken.token });
};

export const checkIsRefreshTokenAvailable = wrapper(
  async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    const jwtToken = JwtService.decodeRefreshToken(refreshToken) as string;

    const user = JwtService.decode(jwtToken);

    const existsRefreshToken = await RefreshToken.findOne({
      token: refreshToken,
    });

    if (existsRefreshToken.expireDate < Date.now()) {
      return res.status(401).send('Expired Token =(');
    }

    await JwtService.updateRefreshTokenExpireDate(refreshToken);

    const token = JwtService.encode(user);

    return res.send({ token, refreshToken: refreshToken.token });
  }
);
