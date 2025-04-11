import express, { Request, Response } from "express";
import LoginServices from "@services/login.services";
import User, { UserRole } from "@entities/User";
import session from "@typesexpress-session";

class LoginController {

    static async getLoginPage(req: Request, res: Response) {
        try {
            let {email, errorlogin} = req.cookies;
            let errorMessage = null;
            // console.log(email);
            return res.render('./loginPages/sign-in', {email, errorlogin, errorMessage} );
        } catch (error) {
            return res.status(500).json({ message: "An error occurred", error });
        }
    }

    // Make this method async to use await
    static async login(req: Request, res: Response) {
        try {
            
            const { email, password } = req.body;
            let check = [];
            check[email] = 0;

            if (!email || !password) {
                console.error("Email or password not provided");
                return null;
            }
            const result = await LoginServices.CheckLogin(email, password);
    
            if (!result) {
                res.cookie("errorlogin",'invalid email or password');
                return res.render('./loginPages/sign-in', { errorMessage: 'Invalid credentials', email: null, errorlogin: 'Invalid credentials' });
            }

            if(result.isActive == false) {
                res.cookie("errorlogin",'Account is not active');
                return res.render('./loginPages/sign-in', { errorMessage: 'Account is not active', email: null, errorlogin: 'Account is not active' });
            }
            

            req.session._user = result;
            req.session.save();
    
            if (req.session && req.session._user) {
                res.redirect('/'); 
            } else {
                res.redirect('/login');
            }
        } catch (error) {
            console.error('Error during login:', error);
            return res.status(500).json({ message: "An error occurred", error });
        }
    }
    
    static async logout(req: Request, res: Response){
        try {
            req.session.destroy((err) => {
                if (err) {
                    return res.status(500).send("An error occurred during logout.");
                }
                res.clearCookie('connect.sid', { path: '/' });
                res.clearCookie('user', { path: '/' });
                res.clearCookie('userid', { path: '/' });
                res.redirect('/');
            });
        } catch (error) {
            res.status(500).send("An error occurred during logout.");
        }
    }
}


export default LoginController;
