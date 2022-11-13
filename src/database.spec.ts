import { Types } from "mongoose";
import "./config/config";
import db from "./database";
import User from "./models/user";

describe("Users", ()=>{
    beforeAll(()=> {
        db.on("open",()=>{
            console.log("Database starts successfully");
        })
    });

    beforeEach(async() => {
        if (await db.collection("users").countDocuments()){
            return db.collection("users").deleteMany({});
        }
    });

    afterAll(()=>{
        return db.close();
    });

    describe("User Creation", ()=> {
        it("Should add new user to database", async() =>{
            const newUser = new User({
                email:"mail@mail1.com",
                password: "password"
            });

            const createdUser = await User.create(newUser);
            expect(createdUser).toEqual(createdUser);
        });

        it("Should add a list of usrs to database", async()=>{
            const users = [
                {
                    email:"user1@user1.com",
                    password:"password1"
                },
                {
                    email:"user2@user2.com",
                    password:"password2"
                }
            ];
            const createdUsers = await User.create(users);
            expect(createdUsers).toHaveLength(2);
        });

        it("Should returns an error if email is missing", async()=>{
            const newUser = new User({
                password:"password1"
            });
            await expect(User.create(newUser)).rejects.toThrow("Path `email` is required");
        })
    })

    describe("User Delete", () => {
        it("Should not delete unexistant user", async () => {
            const updatedUser = await User.findByIdAndRemove(new Types.ObjectId());
            expect(updatedUser).toBeNull();
        });
    });
})