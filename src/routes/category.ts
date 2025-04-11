import express, { Express, Request, Response, Router } from "express";
const router: Router = express.Router();
import upload from "@middlewaresmulter.config";
import ProductController from "@controllersproduct.controller";
import CategoryController from "@controllerscategory.controller";
import checkSession from "@middlewares/auth.middleware";
import { UserRole } from "@entitiesUser";


// category routes 
router.get('/categoryServices', checkSession, async (req: Request, res: Response) => {
    if (req.session && req.session._user ) {
        if(req.session._user.Role == UserRole.Admin){
          res.render('./pages/admin/categoryservices', {isLoggedIn: true, user: req.session._user});
        }
        else{
          res.redirect('/');
        }
    } else {
        return res.redirect('/login');
    }
});

router.get('/category/:id', async (req: Request, res: Response) => {
    if(req.session._user?.isActive == false) {
        res.redirect('/login');
        return;
    }
    await CategoryController.getProductbycategory(req, res);
});

router.get('/createCategory', checkSession,  async (req: Request, res: Response) => {
    return res.render('./pages/admin/createCategory');
});

router.post('/createCategory', upload.single('ImageUrl'), async (req: Request, res: Response) => {
    await CategoryController.createCategory(req, res);
});

router.get('/getAllCategory', async (req: Request, res: Response) => {
    await CategoryController.getAllCategory(req, res);
});

router.get('/get12Category', async (req: Request, res: Response) => {
    await CategoryController.get12Category(req, res);
});

router.get('/editCategory/:id', checkSession, async (req: Request, res: Response) => {
    await CategoryController.editPage(req, res);
});

router.post('/editCategory/:id', upload.single('ImageUrl'), async (req: Request, res: Response) => {
    await CategoryController.Update(req, res);
});

router.delete('/deleteCategory/:id', CategoryController.Delete);

export default router;
