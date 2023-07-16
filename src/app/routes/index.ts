import express from 'express';
import { AuthRoutes } from '../modules/auth/auth.routes';
import { bookRoutes } from '../modules/book/book.routes';

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
];

moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;
