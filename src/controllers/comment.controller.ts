import { Request, Response } from "express";
import Commentservices from "@services/comment.services";

class CommentController{
    static async commentwithUser(request: Request, response: Response){
        await Commentservices.commentwithUser(request, response);
    }
    
    static async getcommentbyId(request: Request, response: Response){
        await Commentservices.getcommentbyId(request, response);
    }

    static async getcomments(request: Request, response: Response){
        await Commentservices.getcomments(request, response);
    }

    static async updatecomment(request: Request, response: Response){
        await Commentservices.updateComment(request, response);
    }

    static async deleteCommentbyAdmin(request: Request, response: Response){
        await Commentservices.deleteCommentbyAdmin(request, response);
    }
    static async deleteComment(request: Request, response: Response){
        await Commentservices.deleteComment(request, response);
    } 

}

export default CommentController;