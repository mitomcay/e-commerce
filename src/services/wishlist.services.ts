import checkSession from "@middlewares/auth.middleware";
import session from "@typesexpress-session";
import Product from "@entities/Product";
import Category from "@entitiesCategory";
import Cart from "@entitiesCart";
import { CartItem } from "@entitiesCartItem";
import User from "@entitiesUser";
import { AppDataSource } from "@configdata-source";
const productRepository = AppDataSource.getRepository(Product);
const cartRepository = AppDataSource.getRepository(Cart);
const cartitemRepository = AppDataSource.getRepository(CartItem);
import { Request, Response } from "express";
import Like from "@entitieslike";



class wishlistservices{

    static async getWishlist(req: Request, res: Response){
        try{
            if(!req.session._user){
                res.json({ success: false, message: 'please login ', href: 'login'});
                return;
            }
            const wishlist = await AppDataSource.getRepository(Like).find({
                where: { user: { id: req.session._user.id } },
                relations: ['product']
            });
            if(!wishlist){
                return res.status(400).json({ success: false, message: 'You do not have any wishlist' });
            }
            return res.status(200).json({ success: true, wishlist: wishlist });
        }catch(e){
            console.error('Error getting wishlist:', e);
            res.status(500).json({ success: false, message: 'An error occurred while getting wishlist' });
        }
    }
    static async addToWishlist(req: Request, res: Response){
        try{
            if(!req.session._user){
                res.json({ success: false, message: 'please login ', href: 'login'});
                return;
            }

            const id = parseInt(req.params.id);
        
            const product = await productRepository.findOne({
                where: { id: id },
                relations: ['categories']
            });

            if(!product){
                return res.status(404).json({ success: false, message: 'Product not found' });
            }
            const existwishlist = await AppDataSource.getRepository(Like).findOne({
                where: { product: { id: product.id }, user: { id: req.session._user.id } }
            })
            if(existwishlist){
                return res.status(200).json({ message: 'Your choose product existed in your wishlist'});
            }

            const wishlist = new Like();
            wishlist.product = product;
            wishlist.user = req.session._user;

            await AppDataSource.getRepository(Like).save(wishlist);

            return res.status(200).json({ message: 'Your choose product added your wishlist successfully'})

        } catch (error){
            console.error('Error adding product to cart:', error);
            res.status(500).json({ success: false, message: error });
        }
    }
    

    static async removeFromWishlist(req: Request, res: Response) {
        try {
            const productIdinwishlist = parseInt(req.params.productId);
            
            // console.log(productIdinwishlist);    
            const wishlist = await AppDataSource.getRepository(Like).findOne({
                where: { product: { id: productIdinwishlist }, user: { id: req.session._user?.id } }
            });

            if (!wishlist) {
                return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại trong danh sách yêu thích' });
            }
            await AppDataSource.getRepository(Like).remove(wishlist);

            res.status(200).json({ success: true, message: 'remove success' });
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error);
            res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi xóa sản phẩm khỏi giỏ hàng' });
        }
    }

    static async wishlistcount(req: Request, res: Response): Promise<any> {
        if(!req.session._user){
            return res.redirect('/login')
        }


        const userId = req.session._user?.id;

        const wishlist = await AppDataSource.getRepository(Like).find({
            where: { user: {id: userId} },
            relations: ['product']
        })

        let totalItems = wishlist.length;

        // console.log("Total items in wishlist:", totalItems);
        res.json({ totalItems });
    }
    
}

export default wishlistservices;