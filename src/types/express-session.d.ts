import session, { SessionData } from 'express-session';
import User from '@entitiesUser';
import Cart from '@entitiesCart';

declare module 'express-session' {
  interface SessionData {
    _user?: User;
    cart?: any[];
  }
}
  
