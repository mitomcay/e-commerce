import { NextFunction, Request, Response } from "express";
import session from "@typesexpress-session";
import User, { UserRole } from "@entities/User";

const checkLogin = (req: any, res: Response, next: NextFunction ) => {
   if (req.session && req.session._user) {
        res.redirect('/'); 
    } else {
        next();
    }
};

export default checkLogin;