import express, { Request, Response } from "express";
import { AppDataSource } from "@config/data-source";
import User from "@entities/User";
const userRepository = AppDataSource.getRepository(User);
import bcrypt from 'bcrypt';
import { UserRole, UserGender } from "@entitiesUser";
import dotenv from 'dotenv';
dotenv.config();
import "reflect-metadata"

class RegisterService{
    static async createAccount (req: Request, res: Response){
        try{
            const {firstname, lastname, birthdate, gender, phone, ward, district, province, email, password, confirmPassword} = req.body;
            if (password !== confirmPassword) {
                throw new Error("Mật khẩu và xác nhận mật khẩu không khớp!");
            }
            const birthDate = new Date(birthdate);
            const age = new Date().getFullYear() - birthDate.getFullYear();
            const hasPassedBirthday = new Date().getMonth() < birthDate.getMonth() || 
                (new Date().getMonth() === birthDate.getMonth() && new Date().getDate() < birthDate.getDate());
            const finalAge = hasPassedBirthday ? age : age - 1;

            // console.log(`Age: ${finalAge}`);

            const saltRounds: number = 10;
            const hashedPassword: string = await bcrypt.hash(password, saltRounds);

            const user = new User();
            user.firstName = firstname;  // Gán giá trị cho firstName
            user.lastName = lastname;    // Gán giá trị cho lastName
            user.age = finalAge;              // Gán giá trị cho age
            user.email = email;          // Gán giá trị cho email
            user.password = hashedPassword;    // Gán giá trị cho password
            user.phone = phone;          // Gán giá trị cho phone
            user.isActive = true;        
            user.Role = UserRole.User;    
                 // Gán giá trị cho role
            if (gender === "Male") {
                user.Gender = UserGender.Male;
                user.ImageUrl =  'default-boy.jpg';
            } else if (gender === "Female") {
                user.Gender = UserGender.Female;
                user.ImageUrl =  'default-girl.jpg';
            } else {
                user.Gender = UserGender.Other; 
                user.ImageUrl =  'default-other.jpg';  // Gán giá trị cho gender
            } 
            user.ward = ward || 'default';
            user.district = district || 'default';
            user.province = province || 'default';
            res.cookie('email', email, {maxAge: 24 * 60 * 60 , httpOnly: false}  );
            await userRepository.save(user); 

            // const newcart = new Cart();
            // newcart.user = user;
            // await AppDataSource.getRepository(Cart).save(newcart);

        }
        catch(error){
            console.log(error);
            throw new Error('An error occurred while creating account');
        }
    }


}

export default RegisterService;


