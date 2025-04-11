import express, { Express, Request, Response, Router } from "express";
const router: Router = express.Router();
import upload from "@middlewaresmulter.config";
import ProductController from "@controllersproduct.controller";
import CategoryController from "@controllerscategory.controller";
import checkSession from "@middlewares/auth.middleware";
import { UserRole } from "@entitiesUser";

// product routes
router.get('/productServices', checkSession, async (req: Request, res: Response) => {
    if (req.session && req.session._user ) {
        if(req.session._user.Role == UserRole.Admin){
            res.render('./pages/admin/productservices', {isLoggedIn: true, user: req.session._user});
        }
        else{
            res.redirect('/');
        }
    } else {
        return res.redirect('/login');
    }
});

router.get('/search-products/:keywords', async (req: Request, res: Response) => {
    await ProductController.search(req, res);
});

router.post('/api/search/product', async (req: Request, res: Response) => {
    await ProductController.searchproductbymessage(req, res);
});

router.get('/chatbot-search', async (req: Request, res: Response) => {
    await ProductController.chatbotsearch(req, res);
});

router.get('/productDetail/:id', async (req: Request, res: Response) => {
    if(req.session._user?.isActive == false) {
        res.redirect('/login');
        return;
    }
    await ProductController.getProductDetail(req, res);
});

router.get('/createProduct', checkSession, async (req: Request, res: Response) => {
    return res.render('./pages/admin/createProduct');
});

router.post('/createProduct', upload.single('ImageUrl'), async (req: Request, res: Response) => {
    await ProductController.createProduct(req, res);
});

router.get('/getAllProduct', async (req: Request, res: Response) => {
    await ProductController.getAllProduct(req, res);
});


router.get('/get12Product', async (req: Request, res: Response) => {
    await ProductController.get12Product(req, res);
});

router.get('/getrandom4Product', async (req: Request, res: Response) => {
    await ProductController.getrandom4Product(req, res);
});

router.post('/filter-products', async (req: Request, res: Response) => {
    await ProductController.getProductbyprice(req, res);
});

router.post('/filter-products-by-color', async (req: Request, res: Response) => {
    await ProductController.getProductbyColor(req, res);
});

router.get('/getRecentProducts', async (req: Request, res: Response) => {
    await ProductController.getRecentProducts(req, res);
});

router.get('/editProduct/:id', checkSession, async (req: Request, res: Response) => {
    await ProductController.editPage(req, res);
});

router.post('/editProduct/:id', upload.single('ImageUrl'), async (req: Request, res: Response) => {
    await ProductController.Update(req, res);
});

router.post('/comment', async (req: Request, res: Response) => {
    await ProductController.Comment(req, res);
});

router.delete('/deleteProduct/:id', ProductController.Delete);

export default router;
