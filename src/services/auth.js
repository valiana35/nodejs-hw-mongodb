import createHttpError from 'http-errors';
import { User } from '../db/user.js';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { Session } from '../db/session.js';
import {
  ENV_VARS,
  FIFTEEN_MINUTES,
  SMTP,
  TEMPLATES_DIR,
  THIRTY_DAYS,
} from '../constants/constans.js';
import jwt from 'jsonwebtoken';
import { env } from '../utils/env.js';
import { sendEmail } from '../utils/sendMail.js';
import handlebars from 'handlebars';
import path from 'node:path';
import fs from 'node:fs/promises';

export const registerUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (user) throw createHttpError(409, 'Email in use');

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  return await User.create({
    ...payload,
    password: encryptedPassword,
  });
};

export const loginUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const isEqual = await bcrypt.compare(payload.password, user.password);
  if (!isEqual) {
    throw createHttpError(401, 'Unauthorized!');
  }

  await Session.deleteOne({ userId: user._id });

  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return await Session.create({
    userId: user._id,
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  });
};

export const logoutUser = async ({ sessionId, refreshToken }) => {
  await Session.deleteOne({
    _id: sessionId,
    refreshToken,
  });
};

const createSession = () => {
  const accessToken = randomBytes(30).toString('base64');
  const refreshToken = randomBytes(30).toString('base64');

  return {
    accessToken,
    refreshToken,
    accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
    refreshTokenValidUntil: new Date(Date.now() + THIRTY_DAYS),
  };
};

export const refreshUsersSession = async ({ sessionId, refreshToken }) => {
  const session = await Session.findOne({
    _id: sessionId,
    refreshToken,
  });
  if (!session) {
    throw createHttpError(401, 'Session not found');
  }

  const isSessionTokenExpired =
    new Date() > new Date(session.refreshTokenValidUntil);
  if (isSessionTokenExpired) {
    throw createHttpError(401, 'Session token expired');
  }

  const newSession = createSession();

  await Session.deleteOne({ _id: sessionId, refreshToken });

  return await Session.create({
    userId: session.userId,
    ...newSession,
  });
};

export const requestResetToken = async (email) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw createHttpError(404, 'User not found');
  }
  const resetToken = jwt.sign(
    {
      sub: user._id,
      email,
    },
    env('JWT_SECRET'),
    {
      expiresIn: '5m',
    },
  );

  const resetPasswordTemplatePath = path.join(
    TEMPLATES_DIR,
    'reset-password-email.html',
  );

  const templateSource = (
    await fs.readFile(resetPasswordTemplatePath)
  ).toString();

  const template = handlebars.compile(templateSource);
  const html = template({
    name: user.name,
    link: `${env(ENV_VARS.APP_DOMAIN)}/reset-password?token=${resetToken}`,
  });

  try {
    await sendEmail({
      from: env(SMTP.SMTR_FROM),
      to: email,
      subject: 'Reset your password',
      html,
    });
  } catch (error) {
    console.log(error);
    throw createHttpError(500, 'Failed to send the email, please try again later!');
  }
};

export const resetPwd = async (payload) => {
  let entries;

  try {
    entries = jwt.verify(payload.token, env(ENV_VARS.JWT_SECRET));
  } catch (error) {
    if (error instanceof Error) throw createHttpError(401, error.message);
    throw error;
  }

  const user = await User.findOne({
    email: entries.email,
    _id: entries.sub,
  });

  if (!user) {
    throw createHttpError(404, 'User not found');
  }

  const encryptedPassword = await bcrypt.hash(payload.password, 10);

  await User.updateOne(
    { _id: user._id },
    { password: encryptedPassword },
  );
};
