import { Request, Response } from "express";
import { AppDataSource } from "@config/data-source";
import Category from "@entities/Category";
import "reflect-metadata";
import Product from "@entitiesProduct";
const categoryRepository = AppDataSource.getRepository(Category);

class CategoryService{
    static async createCategory(req: Request, res: Response){
        try{
            const data = req.body;
            // console.log(data);

            const category = new Category();
            category.CategoryName = data.categoryname;
            category.ImageUrl = req.file?.filename;
            
            await categoryRepository.save(category);
            res.redirect('/createCategory');
        }
        catch (error){
            console.log(error);
            res.status(500).json({ message: 'An error occurred while creating product' });
        }
    }

    static async getAllCategory(req: Request, res: Response) {
        try {
            const categories = await categoryRepository.find();
            
            if (!categories.length) {
                return res.status(404).json({ message: 'No products found' });
            }
    
            // console.log('Fetched products:', JSON.stringify(products, null, 2));
            res.status(200).json({ data: categories });
        } catch (error) {
            console.error("Error fetching products:", error);
            res.status(500).json({ message: 'Error fetching products', error: error });
        }
    }

    static async get12Category(req: Request, res: Response) {
        try {
            const categories = await categoryRepository.find({
                take: 12,
            });
            
            if (!categories.length) {
                return res.status(404).json({ message: 'No products found' });
            }
    
            // console.log('Fetched products:', JSON.stringify(products, null, 2));
            res.status(200).json({ data: categories });
        } catch (error) {
            console.error("Error fetching products:", error);
            res.status(500).json({ message: 'Error fetching products', error: error });
        }
    }

    static async editPages(req: Request, res: Response) {
        try {
            const categoryId = parseInt(req.params.id); 
            // console.log('Product ID:', productId);
            
            if (isNaN(categoryId)) {
                return res.status(400).json({ message: 'Invalid product ID' });
            }

            const category = await categoryRepository.findOneBy({ id: categoryId });
            // console.log(category);

            if (!category) {
                return res.status(404).json({ message: 'Product not found' });
            }
            res.render('./pages/admin/editCategory', { category });
        }
        catch (error) {
            console.error("Error fetching products:", error);
            res.status(500).json({ message: 'Error fetching products', error: error });
        }
    }

    static async getProductbycategory(req: Request, res: Response){
            try{
                const categoryId = parseInt(req.params.id);
                const category = await categoryRepository.findOne({
                    where: { id: categoryId}
                })
                const products = await AppDataSource.getRepository(Product).find({
                    relations: ['categories'],
                    where: {
                        categories: { id: categoryId },
                        isActive: true
                    }
                });
                
                if (req.session && req.session._user) {
                    res.render('./shop/category', {isLoggedIn: true, user: req.session._user, category, products });
                } else {
                    res.render('./shop/category', {isLoggedIn: false, user: null, category, products});
                }
                
            }catch(e){
                console.log(e);
                res.status(500).json({ message: 'An error occurred while fetching products by category' });
            }
        }

    static async updateCategory(req: Request, res: Response) {
        try{
            const data = req.body;
            // console.log(data);
            const id = parseInt(req.params.id);
            
            if (isNaN(id)) {
                return res.status(400).json({ message: 'Invalid product ID' });
            }

            const category = await categoryRepository.findOne({ 
                where: { id }
            });

            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }

            category.CategoryName = data.categoryname;
            category.ImageUrl = req.file?.filename;

            await categoryRepository.save(category);

            res.redirect(`/editCategory/${id}`);

        } catch (e){
            console.error("Error fetching products:", e);
            res.status(500).json({ message: 'Error fetching products', error: e });
        }
    }

    static async deleteCategory(req: Request, res: Response): Promise<any>{
        try{
            const id = parseInt(req.params.id);
            // console.log(id);

            const category = await categoryRepository.findOne({  where: { id: id }});
            
            if (!category) {
                return res.status(404).json({ message: 'Category not found' });
            }

            await categoryRepository.softDelete(id);
            res.status(200).json({ message: 'Category deleted'});
        } catch(error){
            console.log(error);
            res.status(500).json({ message: 'An error occurred while deleting product' });
        }
    }
}

export default CategoryService;