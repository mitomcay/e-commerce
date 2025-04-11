import express, { Request, Response } from "express";
import RegisterServices from "@services/register.services";
import User from "@entities/User";
import { AppDataSource } from "@config/data-source";
const userRepository = AppDataSource.getRepository(User);
import { register } from "module";

const Regex = /^[a-zA-Z0-9._%+-]+@(gmail|outlook|hotmail|yahoo|epu|edu)\.(com|vn|edu\.vn)$/;

class RegisterController {

    static async getRegisterPage(req: Request, res: Response) {
        try {
            return res.render('./loginPages/sign-up', {message: null});
        } catch (error) {
            return res.status(500).json({ message: "An error occurred", error });
        }
    }

    // Make this method async to use await
    static async Register(req: Request, res: Response) {
        try {
            const {firstname, lastname, birthdate, gender, phone, ward, district, province, email, password, confirmPassword} = req.body;
            // console.log(firstname, lastname, birthdate, gender, phone, ward, district, province, email, password, confirmPassword);
            const user: any = await userRepository.findOneBy({ email: email, phone: phone});
            if(user){
                res.render('./loginPages/sign-up', { message: `${email} or ${phone} was existed`});
            }
            await RegisterServices.createAccount(req, res);

            res.redirect('/login');
        } catch (error) {
            return res.status(500).json({ message: "An error occurred", error });
        }
    }
}


export default RegisterController;
