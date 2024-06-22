import createHttpError from 'http-errors';
import { Session } from '../db/session.js';
import { User } from '../db/user.js';

export const checkToken = async (req, res, next) => {
  const authHeader = req.get('Authorization');
  if (!authHeader) {
    next(createHttpError(401), 'Authorization header is absent');
    return;
  }
  const [bearer, token] = authHeader.split(' ');
  if (bearer !== 'Bearer' || !token) {
    next(createHttpError(401), 'Authorization header is invalid');
    return;
  }
  const session = await Session.findOne({ accessToken: token });
  if (!session) {
    next(createHttpError(401), 'Session not found');
    return;
  }
  const isAccessTokenExpired = Date.now() > session.accessTokenValidUntil;
  if (isAccessTokenExpired) {
    next(createHttpError(401), 'Access token expired');
    return;
  }
  const user = User.findById(session.userId);
  if (!user) {
    next(createHttpError(401), 'User not found');
    return;
  }
  req.user = user;
  next()
};
