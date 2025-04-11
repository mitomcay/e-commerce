import express, { Request, Response, Router } from "express";
import WishlistController from "@controllerswishlist.controller";
import checkSession from "@middlewaresauth.middleware";

const router: Router = express.Router();

router.get('/likes', checkSession, async (req: Request, res: Response) => {
  if (req.session && req.session._user) {
    if(req.session._user.isActive == false) {
      res.redirect('/login');
      return;
    }
    res.render('./shop/like', {isLoggedIn: true, user: req.session._user}); // Lưu trữ đối tượng User trong session
  } else {
    res.render('./shop/like', {isLoggedIn: false, user: null}); // L}); // L
  }
});

router.get('/get-data-wishlist', async (req: Request, res: Response) => {
    await WishlistController.getwishlist(req, res);
});

router.post('/add-to-wishlist/:id', async (req: Request, res: Response) => {
  await WishlistController.addToWishlist(req, res);
});

router.get('/wishlist-count', async (req: Request, res: Response) => {
  await WishlistController.wishlistcount(req, res);
});


router.delete('/remove-from-wishlist/:productId', async (req: Request, res: Response) => {
  await WishlistController.removeFromWishlist(req, res);
})

export default router;

