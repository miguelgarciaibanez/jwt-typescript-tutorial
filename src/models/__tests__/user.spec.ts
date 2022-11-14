import User from '../user';
import { Types } from "mongoose";
import "../../config/config";
import bcrypt from 'bcrypt';


describe ("Users Model", () => {
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
        
    });
    
    describe("READ users",()=> {
        it("Should return the list of users successfully",()=>{
            const mockedUserList = [
                {
                    _id: new Types.ObjectId(),
                    email:"mail@mai.com",
                    password:"pwd1"
                },
                {
                    _id: new Types.ObjectId(),
                    email:"mail2@mai.com",
                    password:"pwd2"
                }
            ];
            const spy = jest.spyOn(User, "find").mockReturnValueOnce(mockedUserList as any);
            User.find({});
    
            const spyFetchedUsers = spy.mock.results[0].value;
            expect(spy).toHaveBeenCalledTimes(1);
            expect(spyFetchedUsers).toHaveLength(2);
            spy.mockReset();
        });
    });


    describe("Compare passwords", ()=>{
        it("Should return true comparing passwords", async ()=>{
            const mockUser = {
                email: "user@emailmocked.com",
                password: "password"
            }
    
            const user = new User(mockUser);
            jest.spyOn(bcrypt,"compare").mockReturnValueOnce(true as any);
            const res = await user.comparePassword("password");
            expect(res).toBe(true);
        });
        
    })
})
