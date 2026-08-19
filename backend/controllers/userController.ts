import { Request, Response } from 'express';
import { createUserService } from '../services/userService';


export const createUser = async (req: Request, res: Response) => {
    try{
        const { name, email, username, password } = req.body;
        
        if (!name || !email || !username || !password) {
            return res.status(400).json({
                message: 'Bad Request'
            });
        }

        const user = await createUserService(name, email, username, password);

       res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        });
        
     } catch (error: any) {
        if (error.code === 11000) {
            const duplicatedField = Object.keys(error.keyPattern || {})[0];

            return res.status(409).json({
                message: `${duplicatedField} already exists`
            });
        }

        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};

