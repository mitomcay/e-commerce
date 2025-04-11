import { Request, Response, NextFunction } from "express";
import session from "@typesexpress-session";

const checkSession = (req: Request, res: Response, next: NextFunction): void => {
  if (req.session._user && req.session) {
    // Nếu user tồn tại trong session, cho phép tiếp tục
    return next();
  }

  // Nếu không có user trong session, chuyển hướng đến trang đăng nhập
  return res.redirect('/login');
};

export default checkSession;
