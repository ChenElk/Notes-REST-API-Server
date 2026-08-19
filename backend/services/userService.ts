import bcrypt from 'bcrypt';
import { User } from '../models/User';



export const createUserService = async (
  name: string,
  email: string,
  username: string,
  password: string
) => {
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    const user = new User({ name, email, username, passwordHash });
    return user.save();
};

