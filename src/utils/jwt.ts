import jwt, { type SignOptions } from 'jsonwebtoken';
import { config } from '../config/env';

export const generateToken = (payload: object): string => {
  const signOptions: SignOptions = {
    expiresIn: config.jwt.expires_in as SignOptions['expiresIn'],
  };

  return jwt.sign(payload, config.jwt.secret, signOptions);
};

export const verifyToken = (token: string): any => {
  return jwt.verify(token, config.jwt.secret);
};
