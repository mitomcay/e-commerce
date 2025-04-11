import express, { Express, Request, Response, Router } from "express";
const router: Router = express.Router();
import upload from "@middlewaresmulter.config";
import ProductController from "@controllersproduct.controller";
import CategoryController from "@controllerscategory.controller";
import checkSession from "@middlewares/auth.middleware";
import { UserRole } from "@entitiesUser";


// category routes 
router.get('/messagepage', checkSession, async (req: Request, res: Response) => {
    if (req.session && req.session._user ) {
        return res.render('./pages/accountpage/message', {isLoggedIn: true, user: req.session._user});
    } else {
        return res.redirect('/login');
    }
});


export default router;
