import {createToken} from "./token";
import User from "../models/user";
import jwt from 'jsonwebtoken';

describe("Token", ()=>{
    it("Should create new Token", ()=>{
        const mockedUser = new User({
            email: "user@user.com",
            password: "password"
        });
        const jwtCreated = createToken(mockedUser);
        const jwtUnlogged = JSON.parse(JSON.stringify(jwt.decode(jwtCreated)));
        expect(jwtUnlogged.email).toBe(mockedUser.email);
    })
})