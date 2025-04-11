import { AppDataSource } from "@configdata-source";
import OrderItem from "@entitiesOrderItem";
import Comment from "@entitiesComment";
import { Request, Response } from "express";
import Product from "@entitiesProduct";
import { UserRole } from "@entitiesUser";

class Commentservices{
    static async commentwithUser(req: Request, res: Response): Promise<any>{
        try{
            if (!req.session._user) {
                return res.redirect('/login');
            }
    
            const data = req.body;
            // console.log(data); 

            const productid = parseInt(req.params.productid);
    
            const product = await AppDataSource.getRepository(Product).findOne({
                where: { id: productid }
            });
    
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
    
            const newcomment = new Comment();
            newcomment.comment = data.comment;
            newcomment.rating = parseFloat(data.rating);
            newcomment.product = product;
            newcomment.user = req.session._user;
            
            await AppDataSource.getRepository(Comment).save(newcomment);
    
            return res.status(200).json({ message: 'Comment success' });
        } catch(err){
            console.log(err);
            return res.status(500).send('Server error');
        }
    }

    static async getcommentbyId(req: Request, res: Response){
        try{
            const productid = parseInt(req.params.productid);

            const comment = await AppDataSource.getRepository(Comment).find({
                where: {product: {id: productid}},
                relations: ['user']
            }); 

            if(comment){
                return res.json({ comment });
            } else {
                return res.status(404).json({ message: 'No comment found' });
            }
        }catch(e){
            console.log(e);
            return res.status(500).send('Server error');
        }
    }

    static async getcomments(req: Request, res: Response){
        try{
            if(!req.session._user){ 
                res.status(404).json({ message: "you don't have permission for this order " }); 
            }
            const comment = await AppDataSource.getRepository(Comment).find({
                relations: ['user', 'product']
            }); 

            if(comment){
                return res.json({ comment });
            } else {
                return res.status(404).json({ message: 'No comment found' });
            }
        }catch(e){
            console.log(e);
            return res.status(500).send('Server error');
        }
    }

    static async deleteCommentbyAdmin(req: Request, res: Response){
        try{
            if(!req.session._user){ 
                res.status(404).json({ message: "you must be login" }); 
            }

            if(req.session._user?.Role !== UserRole.Admin){
                return res.status(403).json({message: "you don't have permission to this request."});
            }
            const commentId = parseInt(req.params.id);
            const comment = await AppDataSource.getRepository(Comment).findOne({
                where: { id: commentId },
                relations: ['user', 'product']
            });

            if(comment){
                await AppDataSource.getRepository(Comment).softDelete( comment.id );
            } else {
                return res.status(404).json({ message: 'No comment found' });
            }

            return res.status(200).json({ message: 'Comment deleted successfully' });
        } catch(e) {
            console.log(e);
            return res.status(500).send('Server error');
        }
    }

    static async deleteComment(req: Request, res: Response){
        try{
            if(!req.session._user){ 
                res.status(404).json({ message: "you must be login" }); 
            }

            const commentId = parseInt(req.params.id);

            const user = req.session._user; 

            const comment = await AppDataSource.getRepository(Comment).findOne({
                where: { id: commentId, user: {id: user?.id}},
                relations: ['user', 'product']
            });

            if(comment){
                await AppDataSource.getRepository(Comment).softDelete( comment.id );
            } else {
                return res.status(404).json({ message: 'No comment found' });
            }

            return res.status(200).json({ message: 'Comment deleted successfully' });
        } catch(e) {
            console.log(e);
            return res.status(500).send('Server error');
        }
    }

    static async updateComment(req: Request, res: Response){
        try{
            
        } catch(e) {
            console.log(e);
            return res.status(500).send('Server error');
        }
    }
}

export default Commentservices;