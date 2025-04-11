import express, { Request, Response, Router } from "express";
import LoginController from "@controllers/login.controller";
import BlockIP from "@middlewaresblockIP.middleware";
import checkLogin from "@middlewareschecklogin.middleware";

const router: Router = express.Router();

router.get('/login', checkLogin, async (req: Request, res: Response) => {
  LoginController.getLoginPage(req, res);
});

router.post('/login', /*BlockIP,*/ async (req: Request, res: Response) => {
  LoginController.login(req, res);
});

router.get('/logout', async (req: Request, res: Response) => {
  LoginController.logout(req, res);
})


export default router;

