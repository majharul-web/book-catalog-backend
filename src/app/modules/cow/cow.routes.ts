import express from 'express';
import { CowController } from './cow.controller';
import validateRequest from '../../middlewares/validateRequest';
import { CowValidation } from './cow.validation';

const router = express.Router();

router.post(
  '/create-cow',
  validateRequest(CowValidation.createCowZodSchema),
  CowController.createCow
);

router.patch(
  '/:id',
  validateRequest(CowValidation.updateCowZodSchema),
  CowController.updateCow
);

router.get('/:id', CowController.getSingleCow);
router.delete('/:id', CowController.deleteSingleCow);
router.get('/', CowController.getAllCows);

export const CowRoutes = router;
