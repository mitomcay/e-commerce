import { Request, Response, NextFunction } from "express";
import session from "@typesexpress-session";
import { UserRole } from "@entitiesUser";

const checkRole = (req: Request, res: Response, next: NextFunction): void => {
    if (req.session._user  && req.session) {
        if(req.session._user?.Role == UserRole.Admin) {
            // Nếu user tồn tại trong session, cho phép tiếp tục
            return next();
        }
        else{
            return res.redirect('/')
        }
    }
    // Nếu không có user trong session, chuyển hướng đến trang đăng nhập
    return res.redirect('/login');
};

export default checkRole;
