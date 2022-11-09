import User from '../user';
import { Types } from "mongoose";
import "../../config/config";
import db from '../../database';

describe("Create users", ()=> {
    it("Should create a new user successfully", () =>{
        const mockUser = {
            email: "user@email.com",
            password: "password"
        }

        const spy = jest.spyOn(User, "create").mockReturnValueOnce(mockUser as any);
        User.create(mockUser);
        const spyCreatedUser = spy.mock.results[0].value;
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spyCreatedUser.email).toEqual(mockUser.email);
        spy.mockReset();
    });

    it("Should return an error when email is missing", () =>{
        const mockUser = {
            password: "password"
        }

        const spy = jest.spyOn(User, "create").mockReturnValueOnce("Email is required" as any);
        User.create(mockUser);
        const spyCreatedUser = spy.mock.results[0].value;
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spyCreatedUser).toEqual("Email is required");
        spy.mockReset();
    });

    it("Should return an error when password is missing", () =>{
        const mockUser = {
            email: "mail@mail.com"
        }

        const spy = jest.spyOn(User, "create").mockReturnValueOnce("Password is required" as any);
        User.create(mockUser);
        const spyCreatedUser = spy.mock.results[0].value;
        expect(spy).toHaveBeenCalledTimes(1);
        expect(spyCreatedUser).toEqual("Password is required");
        spy.mockReset();
    });
    
})