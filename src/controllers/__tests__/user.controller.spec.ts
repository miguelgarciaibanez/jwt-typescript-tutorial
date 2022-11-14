import User from '../../models/user';
import * as tokenFunction from '../../misc/token';
import request from "supertest";
import app from "../../app";
import db from "../../database";

describe("Server Apis", ()=>{

    beforeAll(()=>{
        db.on("open",()=>{
            console.log("DB starts successfully");
        });
    });

    beforeEach(async ()=>{
        const countDocuments = await db.collection("users").countDocuments();
        if (countDocuments) {
            return db.collection("users").deleteMany({});
        }
    }); 

    afterAll(()=>{
        return db.close();
    });

    describe("SIGN UP /users", ()=> {
        it("Should create a user successfully", async()=>{
            const mockUser={
                email: "user@user.com",
                password:"password"
            }
            const { status, body } = await request(app).post("/signup").send(mockUser);

            expect(status).toBe(201);
            expect(body.email).toBe(mockUser.email);
        });

        it("Should return 400 when the user exists", async()=>{
            const mockUser = {
                email: "user@emailmocked.com",
                password: "password"
            }

            const user = new User(mockUser);
            jest.spyOn(User, "findOne").mockReturnValueOnce(user as any);
            const { status, error } = await request(app).post("/signup").send(mockUser);
            expect(status).toBe(400);
            const err = JSON.parse(JSON.stringify(error));
            const errText = JSON.parse(err.text);
            expect(errText.msg).toMatch("User already exists")
        });

        it("Should return an error while a user attribute missing", async() =>{
            const mockUser = {
                email: "user@user.com"
            }

            const { status, error } = await request(app).post("/signup").send(mockUser);

            expect(status).toBe(400);
            const err = JSON.parse(JSON.stringify(error));
            const errText = JSON.parse(err.text);
            expect(errText.msg).toMatch("Please. Send your email and password")
        });

    });

    
    describe("SIGNIN /users", ()=>{
        it("Should signInUser", async()=>{
            const mockUser = {
                email: "user@emailmocked.com",
                password: "password"
            }

            const user = new User(mockUser);


            jest.spyOn(User, "findOne").mockReturnValueOnce(user as any);
            jest.spyOn(user, "comparePassword").mockImplementationOnce(() => Promise.resolve(true));
            jest.spyOn(tokenFunction, "createToken").mockReturnValueOnce("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzNzBkMmI5ZTY2OWFjMDZhYTY2OTI2ZSIsImVtYWlsIjoidXNlckB1c2VyLmNvbSIsImlhdCI6MTY2ODMzODM2MSwiZXhwIjoxNjY4NDI0NzYxfQ.c8xSYWUz3HZMcpEOZJ1gJQhCPG1RlGZ2m3wbvOIcjtU")
            const { status, error } = await request(app).post("/signin").send(mockUser);
            expect(status).toBe(200);
        });

        it("Should return an error while a user attribute missing", async() =>{
            const mockUser = {
                email: "user@user.com"
            }

            const { status, error } = await request(app).post("/signin").send(mockUser);

            expect(status).toBe(400);
            const err = JSON.parse(JSON.stringify(error));
            const errText = JSON.parse(err.text);
            expect(errText.msg).toMatch("Please. Send your email and password")
        });
    });

    it("Should return 400 when the user does not exist", async()=>{
        const mockUser = {
            email: "user@emailmocked.com",
            password: "password"
        }

        jest.spyOn(User, "findOne").mockReturnValueOnce(null as any);
        const { status, error } = await request(app).post("/signin").send(mockUser);
        expect(status).toBe(400);
        const err = JSON.parse(JSON.stringify(error));
        const errText = JSON.parse(err.text);
        expect(errText.msg).toMatch("User does not exist");
    });

    it("Should return no match", async()=>{
        const mockUser = {
            email: "user@emailmocked.com",
            password: "password"
        }

        const user = new User(mockUser);

        jest.spyOn(User, "findOne").mockReturnValueOnce(user as any);
        jest.spyOn(user, "comparePassword").mockImplementationOnce(() => Promise.resolve(false));
        const { status, error } = await request(app).post("/signin").send(mockUser);
        expect(status).toBe(400);
        const err = JSON.parse(JSON.stringify(error));
        const errText = JSON.parse(err.text);
        expect(errText.msg).toMatch("Mail or password incorrect");
    });

})
