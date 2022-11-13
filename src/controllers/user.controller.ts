import { Request, Response } from 'express';
import User from '../models/user';
import { createToken } from '../misc/token';


export const signUp = async (req: Request, res: Response):Promise<Response> => {
    if (!req.body.email || !req.body.password){
        return res.status(400).json({msg:'Please. Send your email and password'});
    } 

    const user = await User.findOne({email:req.body.email});
    console.log(user);
    if (user) {
        return res.status(400).json({msg: 'User already exists'});
    }

    const newUser = new User(req.body);
    await newUser.save();

    return res.status(201).json(newUser);
}

export const signIn = async (req: Request, res: Response) => {
    if (!req.body.email || !req.body.password){
        return res.status(400).json({msg:'Please. Send your email and password'});
    }

    const user = await User.findOne({email:req.body.email});
    if (!user) {
        res.status(400).json({message:'User does not exists'});
    }

    const isMatch = await user?.comparePassword(req.body.password);

    if (isMatch && user){

        return res.status(200).json({token:createToken(user)});
    }

    return res.status(400).json({message: 'Mail or password incorrect'});

}