import jwt from 'jsonwebtoken';
import {IUser} from '../models/user';
import config from '../config/config';

export const createToken = ( user: IUser) => {
    return jwt.sign({
        id: user.id,
        email: user.email
    }, config.jwtSecret, {
        expiresIn:86400
    });
}