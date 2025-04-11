import express, { Request, Response, Router } from "express";
import checkSession from "@middlewares/auth.middleware";
import session from "@typesexpress-session";
import axios from "axios";
import OrderService from "@servicesorder.services";
import upload from "@middlewaresmulter.config";
import { AppDataSource } from "@configdata-source";
import User from "@entitiesUser";
import bcrypt from 'bcrypt';
import { Message } from "@entities/Message";

const router: Router = express.Router();

router.get('/profile', checkSession, async (req: Request, res: Response) => {
  if (req.session && req.session._user) {
    if(req.session._user.isActive == false) {
      res.redirect('/login');
      return;
    }
    const location = await OrderService.getLocationName(
      req.session._user?.ward || '',
      req.session._user?.district || '',
      req.session._user?.province || ''
    )
    // console.log(location);

    const messages = await AppDataSource.getRepository(Message).find({
      where: { receiver: req.session._user, status:'sent' },
      order: { createdAt: 'DESC' },
      relations: ['sender']
    })
    res.render('./pages/accountpage/profile', { isLoggedIn: true, user: req.session._user, location: location, messages: messages});
    
  } else {
    return res.redirect('/login');
  }
});


router.post('/change/avatar', upload.single('ImageUrl'), async (req: Request, res: Response) => {
  try{
    if(req.file){
      
      if(!req.session._user){
        res.redirect('/login');
      }

      const user = await AppDataSource.getRepository(User).findOne({ 
        where: {id: req.session._user?.id },
      });
      if(!user){
        res.json({message: 'not found user'});
      }

      if (user) {
        if (req.file) {
          user.ImageUrl = req.file?.filename; // Lấy filename từ file đầu tiên
        }

        await AppDataSource.getRepository(User).save(user);

        req.session._user = user;
        req.session.save();
      }
    
      res.redirect('/profile');
    }
    else{
      res.redirect('/profile');
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'An error occurred while updating avatar' });
  }
})

router.post('/change/user', async (req: Request, res: Response) => {
  try{
      const { firstname, lastname, email, phone, password } = req.body;
      if(!req.session._user){
        res.redirect('/login');
      }

      const user = await AppDataSource.getRepository(User).findOne({ 
        where: {id: req.session._user?.id },
      }); 

      if(!user){
        res.json({message: 'not found user'});
      }

      if (user) {
        if(firstname){
          // console.log(firstname)
          user.firstName = firstname;
        }
        if(lastname){
          user.lastName = lastname;
        }
        if(email){
          user.email = email;
        }
        if(phone){
          user.phone = phone;
        }
        if(password){
          const saltRounds: number = 10;
          const hashedPassword: string = await bcrypt.hash(password, saltRounds);
          user.password = hashedPassword;
        }

        await AppDataSource.getRepository(User).save(user);

        req.session._user = user;
        req.session.save();
      }
    
      res.redirect('/profile');
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: 'An error occurred while updating avatar' });
  }
});


export default router;

