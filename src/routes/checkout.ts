import express, { Request, Response, Router } from "express";
import checkSession from "@middlewares/auth.middleware";
import session from "@typesexpress-session";
import checkoutController from "@controllerscheckout.controller";
import OrderItem from "@entitiesOrderItem";
import { AppDataSource } from "@configdata-source";
import OrderController from "@controllersorder.controller";

const orderRepository = AppDataSource.getRepository(OrderItem);
const router: Router = express.Router();

router.get('/checkout', async (req: Request, res: Response) => {
  try{ 
    if (req.session && req.session._user) {
      if(req.session._user.isActive == false) {
        res.redirect('/login');
        return;
      }
      res.render('./shop/checkout', {isLoggedIn: true, user: req.session._user}); // Lưu trữ đối tượng User trong session
    } else {
      res.render('./shop/checkout', {isLoggedIn: false, user: null});
    }
  } catch (err) {
    console.log(err);
    res.sendStatus(500);
  }
  
});

router.post('/create', async (req: Request, res: Response) => {
    await checkoutController.createPayment(req, res);
});

router.post('/createMoMo', async (req: Request, res: Response) => {
  await checkoutController.createPaymentMoMo(req, res);
});

router.get('/check/:app_trans_id', async (req: Request, res: Response) => {
  try{
    if(!req.session._user){
      res.redirect('/login');
    }
    const apptransid = req.params.app_trans_id;
    res.render('./shop/check', {apptransid:  apptransid });
  } catch(e){
    console.log(e);
    res.sendStatus(500);
  }
});

router.post('/check/:app_trans_id', async (req: Request, res: Response) => {
  await checkoutController.checkPaymentStatus(req, res);
});

router.get('/order-success', async (req: Request, res: Response) => {
  res.render('./shop/orderSuccess');
});

router.post('/callback', async (req: Request, res: Response) => {
  await checkoutController.paymentCallback(req, res);
});


export default router;

