import express, { Request, Response, Router } from "express";
import checkSession from "@middlewares/auth.middleware";
import session from "@typesexpress-session";

const router: Router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  if (req.session && req.session._user) {
    if(req.session._user.isActive == false) {
      res.redirect('/login');
      return;
    }
    res.render('./shop/index', {isLoggedIn: true, user: req.session._user}); // Lưu trữ đối tượng User trong session
  } else {
    res.render('./shop/index', {isLoggedIn: false, user: null});
  }
});

router.get('/shop', async (req: Request, res: Response) => {
  if (req.session && req.session._user) {
    if(req.session._user.isActive == false) {
      res.redirect('/login');
      return;
    }
    res.render('./shop/shop', {isLoggedIn: true, user: req.session._user}); // Lưu trữ đối tượng User trong session
  } else {
    res.render('./shop/shop', {isLoggedIn: false, user: null}); 
  }
});

router.get('/contact', async (req: Request, res: Response) => {
  if (req.session && req.session._user) {
    if(req.session._user.isActive == false) {
      res.redirect('/login');
      return;
    }
    res.render('./shop/contact', {isLoggedIn: true, user: req.session._user}); // Lưu trữ đối tượng User trong session
  } else {
    res.render('./shop/contact', {isLoggedIn: false, user: null}); 
  }
});

export default router;

