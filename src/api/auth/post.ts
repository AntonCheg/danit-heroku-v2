import { Request, Response } from 'express';
import { assign, pick } from 'lodash';
import { UserEntity } from '../../db/entities/user.entity';
import JwtService from '../../services/jwt.service';
import { wrapper } from '../../tools/wrapper.helpers';
import { HttpError } from '../../common/errors';
import { RefreshTokenEntity } from '../../db/entities/refresh-token.entity';
import ms from 'ms';
export const registration = wrapper(async (req: Request, res: Response) => {
  const data = pick(req.body, 'login', 'password', 'role');

  const isLoginInUse = !!(await UserEntity.findOne({ login: data.login }));

  if (isLoginInUse) {
    throw new HttpError('Aaaa');
  }

  const user = new UserEntity();
  assign(user, data);

  // Date.now() + 4

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
    
    const refreshToken = new RefreshTokenEntity();
    refreshToken.token = JwtService.encode(user);
    refreshToken.expiredDate = Date.now() + ms('8h');

    await refreshToken.save();


  return res.send({ token, refreshToken:refreshToken.token});
};

export const checkRefreshToken = async (req: Request, res: Response) => {
  
  const refreshTokenValue = req.body.refreshToken;

  const user = JwtService.decode(refreshTokenValue);

  try {
    const refreshToken = await RefreshTokenEntity.findOne({token: refreshTokenValue})

    if (refreshToken.expiredDate >= Date.now()) {

      refreshToken.expiredDate = Date.now() + ms('8h');
      await refreshToken.save();

      const token = JwtService.encode(user);
      
      return res.send({ token, refreshToken: refreshToken.token });
    }

  } catch (err) {
    return res.status(401).send('Invalid Token');
  }
};
