import express from 'express';
import { BookController } from './book.controller';

const router = express.Router();

router.post('/create-book', BookController.createBook);

router.patch('/:id', BookController.updateBook);
router.patch('/review/:id', BookController.reviewBook);

router.get('/:id', BookController.getSingleBook);
router.delete('/:id', BookController.deleteSingleBook);
router.get('/', BookController.getAllBooks);

export const bookRoutes = router;
