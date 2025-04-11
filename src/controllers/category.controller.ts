import { Request, Response } from "express";
import categoryService from "@services/category.services";

class CategoryController{
    static async createCategory(req: Request, res: Response){
        await categoryService.createCategory(req, res);
    }

    static async getAllCategory(req: Request, res: Response){
        await categoryService.getAllCategory(req, res);
    }

    static async getProductbycategory(req: Request, res: Response){
        await categoryService.getProductbycategory(req, res);
    }

    static async get12Category(req: Request, res: Response){
        await categoryService.get12Category(req, res);
    }

    static async editPage(req: Request, res: Response){
        await categoryService.editPages(req, res);
    }

    static async Update(req: Request, res: Response){
        await categoryService.updateCategory(req, res);
    }

    static async Delete(req: Request, res: Response){
        await categoryService.deleteCategory(req, res);
    }
}

export default CategoryController;