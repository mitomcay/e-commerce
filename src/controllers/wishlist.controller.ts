import wishlistservices from "@services/wishlist.services";
import { Request, Response } from "express";

class Wishlistcontroller{
    static async addToWishlist(req: Request, res: Response){
        await wishlistservices.addToWishlist(req, res);
    }

    static async getwishlist(req: Request, res: Response){
        await wishlistservices.getWishlist(req, res);
    }

    static async removeFromWishlist(req: Request, res: Response){
        await wishlistservices.removeFromWishlist(req, res);
    }

    static async wishlistcount(req: Request, res: Response) {
        await wishlistservices.wishlistcount(req, res);
    }

}

export default Wishlistcontroller;