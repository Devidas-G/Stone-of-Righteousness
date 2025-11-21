import bcrypt from "bcryptjs";
import * as jwt from "jsonwebtoken";
import config from "../../../config/configService";
import { User } from "../models/user.model";

const ACCESS_EXPIRES = process.env.ACCESS_EXPIRES || "15m";
const REFRESH_EXPIRES = process.env.REFRESH_EXPIRES || "7d";

class AuthService {
  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  generateAccessToken(user: { id: string; email: string; role?: string }) {
    const secret = config.getSigningSecret();
    const payload = { sub: user.id, email: user.email, role: user.role };
    return (jwt as any).sign(payload, secret, { expiresIn: ACCESS_EXPIRES });
  }

  generateRefreshToken(userId: string) {
    const secret = config.getSigningSecret();
    return (jwt as any).sign({ sub: userId }, secret, { expiresIn: REFRESH_EXPIRES });
  }

  async saveRefreshToken(userId: string, token: string) {
    await User.findByIdAndUpdate(userId, { $addToSet: { refreshTokens: token } });
  }

  async revokeRefreshToken(token: string) {
    await User.updateOne({ refreshTokens: token }, { $pull: { refreshTokens: token } });
  }

  async verifyAccessToken(token: string) {
    const secret = config.getSigningSecret();
    return (jwt as any).verify(token, secret) as any;
  }

  async verifyRefreshToken(token: string) {
    const secret = config.getSigningSecret();
    return (jwt as any).verify(token, secret) as any;
  }

  async findById(id: string) {
    return User.findById(id).lean();
  }

  async findByRefreshToken(token: string) {
    return User.findOne({ refreshTokens: token });
  }
}

export default new AuthService();
