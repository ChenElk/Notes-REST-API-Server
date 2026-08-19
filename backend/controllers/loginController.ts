import { Request, Response } from 'express';
import { loginUserService } from '../services/loginService';


export const loginUser = async (req: Request, res: Response) => {
    try{
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({
                message: 'Bad Request'
            });
        }

        const result = await loginUserService(username, password);

        res.status(200).json(result);
     }
    catch {
        res.status(401).json({
            message: 'Invalid username or password'
        }); 
    }
}