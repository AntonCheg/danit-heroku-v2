import { Request, Response } from 'express';
import { assign, pick } from 'lodash';
import { HttpError } from '../../common/errors';
import { RefreshToken } from '../../db/entities/refresh-token.entity';
import { UserEntity } from '../../db/entities/user.entity';
import JwtService from '../../services/jwt.service';
import { wrapper } from '../../tools/wrapper.helpers';

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

export const refreshToken = wrapper(async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    const tokenIsInBlackList = await RefreshToken.findOne({ where: { token: refreshToken } });
    if (tokenIsInBlackList) {
      throw new Error('Token is in a black list. Soryan bratan.');
    }
    const oldToken = new RefreshToken({ token: refreshToken });
    await oldToken.save();
    const decodedUser = JwtService.decode(refreshToken);

    const newRefreshToken = JwtService.generateRefreshToken(decodedUser);
    const token = JwtService.generateAccessToken(decodedUser);
    res.send({ refreshToken: newRefreshToken, token });
  } catch (error) {
    return res.status(401).send('Invalid Refresh Token');
  }
});

export const login = wrapper(async (req: Request, res: Response) => {
  const { password, login } = pick(req.body, 'password', 'login');
  const user = await UserEntity.findOne({ login }, { select: ['password', 'id', 'role', 'login'] });

  if (!user || !user.verifyPassword(password)) {
    return res.status(400).send('I dont know you bro');
  }
  const accessToken = JwtService.generateAccessToken(user);
  const refreshToken = JwtService.generateRefreshToken(user);

  return res.send({ accessToken, refreshToken });
});
