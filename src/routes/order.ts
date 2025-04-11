import express, { Request, Response, Router } from "express";
import checkSession from "@middlewares/auth.middleware";
import OrderController from "@controllersorder.controller";
import { UserRole } from "@entitiesUser";

const router: Router = express.Router();

router.get('/order', checkSession, async (req: Request, res: Response) => {
  try{
    if(req.session._user?.isActive == false) {
        res.redirect('/login');
        return;
    }
    res.render('./pages/accountpage/order', {isLoggedIn: true, user: req.session._user});
  } catch (e){
    console.log(e);
    res.sendStatus(500);
  }
});

router.get('/orderAdmin', checkSession, async (req: Request, res: Response) => {
    if (req.session && req.session._user ) {
        if(req.session._user.Role == UserRole.Admin){
            res.render('./pages/manager/orderAdmin', {isLoggedIn: true, user: req.session._user});
        }
        else{
            res.redirect('/');
        }
    } else {
        return res.redirect('/login');
    }
});

router.get('/order/view/:id', checkSession, async (req: Request, res: Response) => {
    await OrderController.OrderView(req, res);
});

router.get('/Admin/order/view/:id', checkSession, async (req: Request, res: Response) => {
    await OrderController.AdminOrderView(req, res);
});

router.put('/order/update/status', checkSession, async (req: Request, res: Response) => {
    await OrderController.updateOrder(req, res);
});

router.post('/cancel-order', checkSession, async (req: Request, res: Response) => {
    await OrderController.CancelOrder(req, res);
});

router.post('/delete-order', checkSession, async (req: Request, res: Response) => {
    await OrderController.DeleteOrder(req, res);
});


router.post('/get-order', checkSession, async (req: Request, res: Response) => {
  await OrderController.getOrder(req, res);
});

router.post('/get-all-order', checkSession, async (req: Request, res: Response) => {
    await OrderController.getAllOrder(req, res);
});

router.get('/print/order/:id', checkSession, async (req: Request, res: Response) => {
    await OrderController.AdminOrderPrint(req, res);
});

router.get('/checkQR/completed', checkSession, async (req: Request, res: Response) => {
    res.render('./shop/QRScan');
});

router.post('/check/completed/:id', checkSession, async (req: Request, res: Response) => {
    await OrderController.ShipperCheckOrder(req, res);
});

export default router;

