import jwt, { JwtPayload, Secret } from 'jsonwebtoken';

const createToken = (
  payload: object,
  secret: Secret,
  expired: object
): string => {
  const token = jwt.sign(payload, secret, expired);
  return token;
};

export const verifyToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};

export const jwtHelper = {
  createToken,
  verifyToken,
};
