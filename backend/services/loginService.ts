import bcrypt from 'bcrypt';
import { User } from '../models/User';
import jwt from 'jsonwebtoken';



export const loginUserService = async (
  username: string,
  password: string
) => {
    const user = await User.findOne({ username });
    if (!user) {
        throw new Error('User not found');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
        throw new Error('Invalid password');
    }

    const secret = process.env.SECRET;

    if (!secret) {
        throw new Error('Missing SECRET environment variable');
    }

    const userForToken = {
    username: user.username,
    id: user._id,
    }

  const token = jwt.sign(userForToken, secret)


   return {
    token,
    username: user.username,
    name: user.name,
    email: user.email,
    };
};
