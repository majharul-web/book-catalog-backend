import express from 'express';
import { WishlistController } from './wishlist.controller';

const router = express.Router();

router.post('/add', WishlistController.addToWishlist);
router.delete('/:id', WishlistController.deleteSingleWishlist);
router.get('/:id', WishlistController.getAllWishlists);

export const wishListRoutes = router;
