import express, {Request, Response, Router} from "express";
import { linkPaymentAccount, getPaymentAccounts, updatePaymentAccount, unlinkPaymentAccount, linkZaloPayAccount } from "@controllerspaymentAccount.Controller";

const router: Router = express.Router();

router.get("/add", (req: Request, res: Response) => {
    if(!req.session._user) return res.redirect('/login');
    res.render("./pages/accountpage/add", { user: req.session._user });
});

router.post("/add", async (req: Request, res: Response) => { linkPaymentAccount(req, res); });

router.post("/link-zalopay", async (req: Request, res: Response) => { linkZaloPayAccount(req, res) });

router.get("/list", async (req: Request, res: Response) => { getPaymentAccounts(req, res); });

router.put("/update/:id", async (req: Request, res: Response) => { updatePaymentAccount(req, res); });

router.delete("/delete/:id", async (req: Request, res: Response) => { unlinkPaymentAccount(req, res); });

export default router;
