import NotificationController from "@controllersnotification.controller";
import express,{ Express, Request, Response, Router } from "express";

const router: Router = express.Router();

router.get('/manager/notification', async (req: Request, res: Response): Promise<any> => {
    try{
        if(req.session._user?.Role !== 'Admin'){
            res.redirect('/');
        }
        res.render('./pages/manager/managerNotification', {isLoggedIn: true, user: req.session._user});
    } catch(err){
        console.error(err);
        res.status(500).send("Server Error");
    }
});


router.post('/createNotification', async (req: Request, res: Response) => {
    await NotificationController.sendNotification(req, res);
})

router.get('/readNotification/:id', async (req: Request, res: Response) => {
    await NotificationController.markAsRead(req, res);
})

router.get('/getNotification', async (req: Request, res: Response) => {
    await NotificationController.getAllNotification(req, res);
})

router.delete('/deleteNotification/:id', async (req: Request, res: Response) => {
    await NotificationController.deleteNotification(req, res);
});

export default router;