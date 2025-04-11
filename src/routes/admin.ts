import express, { Request, Response, Router } from "express";
import checkSession from "@middlewares/auth.middleware";
import session from "@typesexpress-session";
import User, { UserRole } from "@entitiesUser";
import { AppDataSource } from "@configdata-source";
import ReceiptController from "@controllersreceipt.controller";
import UserController from "@controllersuser.controller";
import PaymentAccount from "@entitiesPaymentAccount";

const router: Router = express.Router();

router.get('/admin', checkSession, async (req: Request, res: Response) => {
  if (req.session && req.session._user ) {
    if(req.session._user.Role == UserRole.Admin){
      res.render('./pages/admin/dashboard', {isLoggedIn: true, user: req.session._user});
    }
    else{
      res.redirect('/');
    }
  } else {
    return res.redirect('/login');
  }
});

router.get('/manager/account', checkSession, async (req: Request, res: Response) => {
  if (req.session && req.session._user ) {
    if(req.session._user.Role == UserRole.Admin){
      res.cookie('user', req.session._user, { httpOnly: false }  );
      res.render('./pages/admin/accountservices', {isLoggedIn: true, user: req.session._user});
    }
    else{
      res.redirect('/');
    }
  } else {
    return res.redirect('/login');
  }
});
router.get('/manager/user', checkSession, async (req: Request, res: Response) => {
  if (req.session && req.session._user ) {
    if(req.session._user.Role == UserRole.Admin){
      res.cookie('user', req.session._user, { httpOnly: false }  );
      res.render('./pages/manager/manageruser', {isLoggedIn: true, user: req.session._user});
    }
    else{
      res.redirect('/');
    }
  } else {
    return res.redirect('/login');
  }
});

router.get('/manager/comment', checkSession, async (req: Request, res: Response) => {
  if (req.session && req.session._user ) {
    if(req.session._user.Role == UserRole.Admin){
      res.cookie('user', req.session._user, { httpOnly: false }  );
      res.render('./pages/manager/managercomment', {isLoggedIn: true, user: req.session._user});
    }
    else{
      res.redirect('/');
    }
  } else {
    return res.redirect('/login');
  }
});

router.get('/manager/payment', checkSession, async (req: Request, res: Response) => {
  if (req.session && req.session._user ) {
    if(req.session._user.Role == UserRole.Admin){
      res.cookie('user', req.session._user, { httpOnly: false }  );
      res.render('./pages/manager/managerpayment', {isLoggedIn: true, user: req.session._user});
    }
    else{
      res.redirect('/');
    }
  } else {
    return res.redirect('/login');
  }
});

router.get('/manager/event', checkSession, async (req: Request, res: Response) => {
  if (req.session && req.session._user ) {
    if(req.session._user.Role == UserRole.Admin){
      res.cookie('user', req.session._user, { httpOnly: false }  );
      res.render('./pages/manager/managerevent', {isLoggedIn: true, user: req.session._user});
    }
    else{
      res.redirect('/');
    }
  } else {
    return res.redirect('/login');
  }
});

router.get('/receipt', checkSession, async (req: Request, res: Response) => {
  if (req.session && req.session._user ) {
    const paymentAccounts = await AppDataSource.getRepository(PaymentAccount).find({
      relations: ['user']
    });
    res.render('./pages/accountpage/billing', {isLoggedIn: true, user: req.session._user, paymentAccounts: paymentAccounts});
  } else {
    return res.redirect('/login');
  }
});

router.get('/extendtool', checkSession, async (req: Request, res: Response) => {
  if (req.session && req.session._user ) {
    if(req.session._user.Role == UserRole.Admin){
      res.render('./pages/module/extendtool', {isLoggedIn: true, user: req.session._user});
    }
    else{
      res.redirect('/');
    }
  } else {
    return res.redirect('/login');
  }
});

router.get('/report/finance', checkSession, async (req: Request, res: Response) => {
  if (req.session && req.session._user ) {
    if(req.session._user.Role == UserRole.Admin){
      res.render('./pages/module/reportfinance', {isLoggedIn: true, user: req.session._user});
    }
    else{
      res.redirect('/');
    }
  } else {
    return res.redirect('/login');
  }
});

router.get('/notification', checkSession, async (req: Request, res: Response) => {
  if (req.session && req.session._user ) {

      res.render('./pages/accountpage/notifications', {isLoggedIn: true, user: req.session._user});
  } else {
    return res.redirect('/login');
  }
});

router.post('/getAllUser', async (req: Request, res: Response) => {
  try{
    if(!req.session._user){
      res.redirect('/login');
    }

    if(req.session._user?.Role != UserRole.Admin){
      res.status(403).json({message: "you don't have permission to this request."});
    }

    const user = await AppDataSource.getRepository(User).find();

    if(!user){
      res.status(404).json({ message: "can find user" });
    }

    res.status(200).json({ users: user });
  }catch(err){
    console.error(err);
    res.status(500).send('Server Error');
  }
});

router.put('/User/update/active', async (req: Request, res: Response) => {
  await UserController.UpdateActive(req, res);
});

router.put('/User/update/role', async (req: Request, res: Response) => {
  await UserController.UpdateRole(req, res);
});

router.post('/BanUser/:id', async (req: Request, res: Response) => { 
  await UserController.BanAccount(req, res);
});

router.post('/UnbanUser/:id', async (req: Request, res: Response) => { 
  await UserController.UnbanAccount(req, res);
});

router.post('/getMoneyToday', async (req: Request, res: Response) => {
  await ReceiptController.getMoneyToday(req, res);
});

router.get('/api/getRoleUser', async (req: Request, res: Response) => {
  await UserController.getRole(req, res);
});

router.post('/getMoneyTotal', async (req: Request, res: Response) => {
  await ReceiptController.getMoneyTotal(req, res);
});

router.post('/getRevenue', async (req: Request, res: Response) => {
  await ReceiptController.getRevenue(req, res);
});

router.post('/getUserRevenue', async (req: Request, res: Response) => {
  await ReceiptController.getUserRevenue(req, res);
});

router.post('/getMoneybyWeek', async (req: Request, res: Response) => {
  await ReceiptController.getMoneybyWeek(req, res);
});

router.post('/getUserbyWeek', async (req: Request, res: Response) => {
  await ReceiptController.getUserbyWeek(req, res);
});

router.post('/getAccountToday', async (req: Request, res: Response) => {
  await ReceiptController.getUserToday(req, res);
});

export default router;

