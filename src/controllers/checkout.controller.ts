import express, { Request, Response } from "express";
import checkoutServices from "@servicescheckout.services";

class checkoutController {

    static async createPayment(req: Request, res: Response) {
       await checkoutServices.createPayment(req, res);
    }

    static async checkPaymentStatus(req: Request, res: Response) {
        await checkoutServices.checkPaymentStatus(req, res);
     }

     static async paymentCallback(req: Request, res: Response) {
        await checkoutServices.paymentCallback(req, res);
     }

     static async createPaymentMoMo(req: Request, res: Response) {
        await checkoutServices.createPaymentMoMo(req, res);
     } 
}


export default checkoutController;
