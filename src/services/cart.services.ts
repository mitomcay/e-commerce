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



class cartservices{
    static async addToCart(req: Request, res: Response){
        try{
            const id = parseInt(req.params.id);
        
            const product = await productRepository.findOne({
                where: { id: id },
                relations: ['categories']
            });

            if(!product){
                return res.status(404).json({ success: false, message: 'Product not found' });
            }

            if (!req.session.cart) {
                req.session.cart = [];
            }

            const existingProduct = req.session.cart.find((item: any) => item.id === id);

            if(existingProduct) {
                return res.status(200).json({ message: 'product have in your cart'})
            }
            else{
                req.session.cart.push({
                    id: id,
                    ProductName: product.ProductName,
                    Quantity: 1,
                    ImageUrl: product.ImageUrl,
                    Size: ['default'],
                    Color: ['default'],
                    Weight: product.Weight,
                    Dimensions: product.Dimensions,
                    Description: product.Description,
                    Price: product.Price,
                    Discount: product.Discount
                });
                req.session.save(); 
            }
            return res.status(200).json({ message: 'Your choose product added your cart successfully'})

        } catch (error){
            console.error('Error adding product to cart:', error);
            res.status(500).json({ success: false, message: error });
        }
    }

    static async addToCartWithCount(req: Request, res: Response): Promise<any> {
        try {
            const productId = parseInt(req.params.id);
            const { count, color, size } = req.body;
            // console.log(productId, count);

            const product = await productRepository.findOne({
                where: { id: productId },
                relations: ['categories']
            });

            if(!product){
                return res.status(404).json({ success: false, message: 'Product not found' });
            }

            if (!req.session.cart) {
                req.session.cart = [];
            }

            const existingProduct = req.session.cart.find((item: any) => item.id === productId);

            if(existingProduct) {
                return res.status(200).json({ message: 'Your choose product existed in your cart'});
            }
            else{
                
                req.session.cart.push({
                    id: productId,
                    ProductName: product.ProductName,
                    Quantity: count,
                    ImageUrl: product.ImageUrl,
                    Size: [size],
                    Color: [color],
                    Weight: product.Weight,
                    Dimensions: product.Dimensions,
                    Description: product.Description,
                    Price: product.Price,
                    Discount: product.Discount
                }); 
                req.session.save(); 
            }
            return res.status(200).json({ message: 'Your choose product added your cart successfully'});

        }
        catch(e){
            console.error('Invalid product or count:', e);
            res.status(400).json({ success: false, message: 'Invalid product or count' });
        }
    }

    static async saveCart(req: Request, res: Response) {
        try {
            const data = req.session.cart;
            if (!data || data.length === 0) {
                return res.status(400).json({ success: false, message: 'Cart is empty' });
            }

            // console.log(data);
    
            const userId = req.session._user?.id;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'User is not logged in' });
            }
    
            const user = await AppDataSource.getRepository(User).findOne({ where: { id: userId } });
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
    
            // Tìm cart của người dùng trong database
            let cart = await AppDataSource.getRepository(Cart).findOne({
                where: { user },
                relations: ["cartItems"] // Lấy luôn danh sách CartItem
            });
    
            // Nếu cart đã tồn tại trong database, xóa CartItem cũ
            if (cart) {
                await AppDataSource.getRepository(CartItem).remove(cart.cartItems);
                cart.cartItems = []; // Reset lại CartItems
            } else {
                cart = new Cart();
                cart.user = user;
                await AppDataSource.getRepository(Cart).save(cart);
            }
    
            // Thêm mới CartItem từ session vào cart
            for (let product of data) {
                const findproduct = await AppDataSource.getRepository(Product).findOne({ where: { id: product.id } });
    
                if (!findproduct) {
                    return res.status(404).json({ success: false, message: `Product with ID ${product.id} not found` });
                }
    
                const item = new CartItem();
                item.product = findproduct;
                item.cart = cart;
                item.color = product.Color;
                item.quantity = product.Quantity;
                item.size = product.Size;
                item.price = product.Price;
    
                // Lưu CartItem vào cơ sở dữ liệu
                await AppDataSource.getRepository(CartItem).save(item);
            }
    
            return res.status(200).json({ success: true, message: 'Cart updated successfully' });
    
        } catch (e) {
            console.error('Error saving cart:', e);
            res.status(500).json({ success: false, message: 'An error occurred while updating the cart.' });
        }
    }
    
    static async loadCart(req: Request, res: Response) {
        try {
            const userId = req.session._user?.id;
            if (!userId) {
                return res.status(401).json({ success: false, message: 'User is not logged in' });
            }
    
            const user = await AppDataSource.getRepository(User).findOne({ where: { id: userId } });
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
            
            if(req.session.cart){
              delete req.session.cart;
            }
            req.session.cart = [];
            // Lấy cart từ cơ sở dữ liệu của người dùng
            const cart = await AppDataSource.getRepository(Cart).findOne({
                where: { user },
                relations: ["cartItems"] // Lấy danh sách CartItems và sản phẩm liên quan
            });
    
            if (!cart) {
                return res.status(404).json({ success: false, message: 'Cart not found' });
            }
            
            const items = await AppDataSource.getRepository(CartItem).find({ 
                where: {cart: cart},
                relations: ['product']
            })
            
            for( let item of items){
                req.session.cart.push({
                    id: item.product?.id,
                    ProductName: item.product?.ProductName,
                    Quantity: item.quantity,
                    ImageUrl: item.product?.ImageUrl,
                    Size: item.size,
                    Color: item.color,
                    Weight: item.product?.Weight,
                    Dimensions: item.product?.Dimensions,
                    Description: item.product?.Description,
                    Price: item.product?.Price,
                    Discount: item.product?.Discount
                }); 
                req.session.save(); 
            }

            
    
            // Trả về cart cho người dùng
            return res.status(200).json({ success: true, cart });
        } catch (e) {
            console.error('Error loading cart:', e);
            res.status(500).json({ success: false, message: 'An error occurred while loading the cart.' });
        }
    }
    

    static async removeFromCart(req: Request, res: Response) {
        try {
            const productIdincart = parseInt(req.params.productId);
    
            // Kiểm tra xem có giỏ hàng trong session không
            if (!req.session.cart) {
                return res.json({ success: false, message: 'Không tìm thấy giỏ hàng trong session' });
            }
    
            // Tìm sản phẩm trong giỏ hàng của session
            const index = req.session.cart.findIndex(item => item.id == productIdincart);
            if (index !== -1) {
                // req.session.cart.splice(index, 1);
                req.session.cart = req.session.cart.filter(item => item.id !== productIdincart);
                req.session.save();
                // Kiểm tra xem người dùng có đăng nhập không
                if (req.session._user) {

                    const userId = req.session._user?.id;
                    if (!userId) {
                        return res.status(401).json({ success: false, message: 'User is not logged in' });
                    }
            
                    // Tìm giỏ hàng của người dùng trong cơ sở dữ liệu
                    const cart = await AppDataSource.getRepository(Cart).findOne({
                        where: { user: { id: userId } },
                        relations: ['cartItems']
                    });
                    // console.log(cart);
    
                    if (!cart) {
                        return res.json({ success: false, message: 'Không tìm thấy giỏ hàng của người dùng trong cơ sở dữ liệu' });
                    }
    
                    // Tìm sản phẩm trong cơ sở dữ liệu theo ID
                    const product = await AppDataSource.getRepository(Product).findOne({
                        where: { id: productIdincart }
                    });

                    // console.log(product);
    
                    if (!product) {
                        return res.json({ success: false, message: 'Sản phẩm không tìm thấy trong cơ sở dữ liệu' });
                    }
    
                    // Tìm CartItem để xóa
                    const cartItems = await AppDataSource.getRepository(CartItem).findBy({ 
                        cart: { id: cart.id }, 
                        product: { id: product.id } 
                    });

    
                    if (cartItems.length === 0) {
                        return res.json({ success: false, message: 'Không tìm thấy sản phẩm trong giỏ hàng cơ sở dữ liệu' });
                    }

                    for (const item of cartItems) {
                        // console.log('item', item);
                        await AppDataSource.getRepository(CartItem).delete({ id: item.id });

                    }

                    
                    // Trả về thông báo thành công
                    return res.json({ success: true, message: 'Sản phẩm đã được xóa khỏi db va session' });
                } else {
                    return res.json({ success: true, message: 'Sản phẩm đã được xóa khỏi session' });
                }
                
            } else {
                return res.json({ success: false, message: 'Không tìm thấy sản phẩm trong giỏ hàng của session' });
            }
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm khỏi giỏ hàng:', error);
            res.status(500).json({ success: false, message: 'Đã xảy ra lỗi khi xóa sản phẩm khỏi giỏ hàng' });
        }
    }

    static async findCartbyUser(req: Request, res: Response): Promise<Cart[] | null>{
        try{
            const user = req.session._user;
            if(!user){
                res.status(400).json({ message: "User is required" });
                return null;
            }
            const cart = await cartRepository.find({
                relations: ['user', 'products'],
                where: { user: user }
            });
            return cart.length > 0 ? cart : null;
        }catch(error){
            console.error('Error finding cart:', error);
            res.status(500).json({ success: false, message: error });
            return null;
        }
             
    }

    static async getCartCount(req: Request, res: Response): Promise<any> {
        let cart = req.session.cart || [];
        
        // Tính tổng số lượng sản phẩm trong giỏ hàng
        //let totalItems = cart.reduce((acc, item) => acc + item.ProductCount, 0);

        let totalItems = cart.length;

        // console.log("Total items in cart:", totalItems);
        res.json({ totalItems });
    }
    
    static async updateCart(req: Request, res: Response): Promise<any>{
        try{
            if(!req.session.cart){
                return res.status(400).json({ message: "cart don't existed" })
            } 
            const index = parseInt(req.params.index);
            const { quantity } = req.body;
            const product = req.session.cart[index];
            
            if(!product){
                return res.status(404).json({ message: "Product not found" })
            }
            
            if(quantity <= 0){
                return res.status(400).json({ message: "Quantity must be greater than 0" })
            }
            
            req.session.cart[index].Quantity = quantity;
            req.session.save();
            return res.status(200).json({ message: "Cart updated successfully" });
        } catch(error){
            console.error('Error updating cart:', error);
            res.status(500).json({ success: false, message: error });
        }
    }
}

export default cartservices;