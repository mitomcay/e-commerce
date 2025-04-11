import express, { Request, Response } from "express";
import { AppDataSource } from "@config/data-source";
import User from "@entities/User";
const userRepository = AppDataSource.getRepository(User);
import bcrypt from "bcrypt";

const Regex = /^[a-zA-Z0-9._%+-]+@(gmail|outlook|hotmail|yahoo|epu|edu|mailinator)\.(com|vn|edu\.vn)$/;

class LoginService {
    static async CheckLogin(email: string, password: string): Promise<User | null> {
        try {
            const isEmail = Regex.test(email);
            let user: User | null = null;

            if (isEmail) {
                user = await userRepository.findOneBy({ email: email! });
            } else {
                user = await userRepository.findOneBy({ phone: email! });
            }

            if (!user) {
                // console.error("User not found");
                return null;
            }
    

            if (user.password) {
                const isPasswordValid = await bcrypt.compare(password, user.password!);
                if (!isPasswordValid) {
                    console.error("Invalid password");
                    return null;
                }
            } else {
                console.error("User password not found");
                return null;
            }

            return user;
        } catch (error) {
            console.error("Error during login:", error);
            return null;
        }
    }
}

export default LoginService;
