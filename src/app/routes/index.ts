import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { bookRoutes } from '../modules/book/book.routes';
import { wishListRoutes } from '../modules/wishlist/wishlist.routes';
import { readingListRoutes } from '../modules/readinglist/readinglist.routes';

const router = express.Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/books',
    route: bookRoutes,
  },
  {
    path: '/wishlist',
    route: wishListRoutes,
  },
  {
    path: '/readinglist',
    route: readingListRoutes,
  },
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
