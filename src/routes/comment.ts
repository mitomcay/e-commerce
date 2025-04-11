import express, { Request, Response, Router } from "express";
import CommentController from "@controllerscomment.controller";

const router: Router = express.Router();

router.post('/Comment/:productid', async (req: Request, res: Response) => {
    await CommentController.commentwithUser(req, res);
});

router.get('/getcomments/:productid', async (req: Request, res: Response) => {
    await CommentController.getcommentbyId(req, res);
});


router.post('/get-all-comments', async (req: Request, res: Response) => {
    await CommentController.getcomments(req, res);
})

router.post('/delete-comment-by-admin/:id', async (req: Request, res: Response) => {
    await CommentController.deleteCommentbyAdmin(req, res);
})

router.post('/delete-comment/:id', async (req: Request, res: Response) => {
    await CommentController.deleteComment(req, res);
})

export default router;

