import express from 'express';
import { ReadinglistController } from './readinglist.controller';

const router = express.Router();

router.post('/add', ReadinglistController.addToReadinglist);
router.patch('/:id', ReadinglistController.updateReadinglist);
router.delete('/:id', ReadinglistController.deleteSingleReadinglist);
router.get('/:id', ReadinglistController.getAllReadinglists);

export const readingListRoutes = router;
