import cartservices from "@servicescart.services";
import { Request, Response } from "express";

class Cartcontroller{
    static async addToCart(req: Request, res: Response){
        await cartservices.addToCart(req, res);
    }

    static async addToCartWithCount(req: Request, res: Response){
        await cartservices.addToCartWithCount(req, res);
    }

    static async saveCart(req: Request, res: Response){
        await cartservices.saveCart(req, res);
    }

    static async loadCart(req: Request, res: Response){
        await cartservices.loadCart(req, res);
    }

    static async removeFromCart(req: Request, res: Response){
        await cartservices.removeFromCart(req, res);
    }

    static async cartcount(req: Request, res: Response) {
        await cartservices.getCartCount(req, res);
    }

    static async updateCart(req: Request, res: Response){
        await cartservices.updateCart(req, res);
    }
}

export default Cartcontroller;