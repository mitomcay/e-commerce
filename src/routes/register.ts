import express, { Express, Request, Response } from "express";
import RegisterController from "@controllersregister.controller";
const Router = express.Router();

Router.get('/register', (req: Request, res: Response) => {
    RegisterController.getRegisterPage(req, res);
});

Router.post('/register', async (req: Request, res: Response) => {
    RegisterController.Register(req, res);
});

export default Router;