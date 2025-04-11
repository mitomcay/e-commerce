import { AppDataSource } from "@configdata-source";
import User, { UserRole } from "@entitiesUser";
import { Request, Response } from "express";

class UserService{
    static async UpdateActive(req: Request, res: Response): Promise<any> {
        try{
            if(!req.session._user){
                res.redirect('/login');
            }
            if(req.session._user?.Role != UserRole.Admin){
                res.status(400).json({ message: "you don't have permission to update this user"})
            }
            const { UserId, Active } = req.body;
            // console.log(Active);

            const user = await AppDataSource.getRepository(User).findOne({
                where: {id: UserId},
            });

            if (user !== null) {
                if(Active == "true"){
                    user.isActive = true;
                } else {
                    user.isActive = false;
                }
                await AppDataSource.getRepository(User).save(user); // Lưu user
            } else {
                console.error('User not found');
            }

            res.status(200).json({ message: "User updated successfully"})
        }catch(err){
            res.status(500).json({ message: err });
        }
    }

    static async getRoleSession(req: Request, res: Response): Promise<any> {
        try{
            if(!req.session._user){
                res.redirect('/login');
            }
            const user = req.session._user;
            const userRole = user?.Role;

            res.status(200).json({ userRole });

        }catch(err){
            res.status(500).json({ message: err });
        }
    }

    static async UpdateRole(req: Request, res: Response): Promise<any> {
        try{
            if(!req.session._user){
                res.redirect('/login');
            } 

            if(req.session._user?.Role != UserRole.Admin){
                res.status(400).json({ message: "you don't have permission to update this user"})
            }
            const { UserId, Role } = req.body;
            // console.log(Role);

            const user = await AppDataSource.getRepository(User).findOne({
                where: {id: UserId},
            });

            if (user !== null) {
                if(Role == 'Admin'){
                    user.Role = UserRole.Admin;
                } else if(Role == 'User'){
                    user.Role = UserRole.User;
                } else {
                    user.Role = UserRole.Customer;
                }
                await AppDataSource.getRepository(User).save(user); // Lưu user
            } else {
                console.error('User not found');
            }

            res.status(200).json({ message: "User updated successfully"})
        }catch(err){
            res.status(500).json({ message: err });
        }
    }

    static async BanAccount(req: Request, res: Response): Promise<any> {
        try{
            if(!req.session._user){
                res.redirect('/login');
            }
            if(req.session._user?.Role != UserRole.Admin){
                res.status(400).json({ message: "you don't have permission to update this user"})
            } 

            const id = parseInt(req.params.id);
            // console.log(userId);

            const user = await AppDataSource.getRepository(User).findOne({
                where: {id: id},
            });

            if (user && user.id) {
                user.isActive = false;
                await AppDataSource.getRepository(User).save(user);
            } else {
                console.log('User không tồn tại hoặc không có ID');
            }
            res.status(200).json({ message: 'User have been Banned successfully' });
        }catch(err){
            res.status(500).json({ message: err });
        }
    }

    static async UnbanAccount(req: Request, res: Response): Promise<any> {
        try{
            if(!req.session._user){
                res.redirect('/login');
            }
            if(req.session._user?.Role != UserRole.Admin){
                res.status(400).json({ message: "you don't have permission to update this user"})
            } 

            const id = parseInt(req.params.id);
            // console.log(userId);

            const user = await AppDataSource.getRepository(User).findOne({
                where: {id: id},
            });

            if (user && user.id) {
                user.isActive = true;
                await AppDataSource.getRepository(User).save(user);
            } else {
                console.log('User không tồn tại hoặc không có ID');
            }
            res.status(200).json({ message: 'User have been Unbanned successfully' });
        }catch(err){
            res.status(500).json({ message: err });
        }
    }
}

export default UserService;