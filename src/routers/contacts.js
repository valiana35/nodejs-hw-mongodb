import { Router } from 'express';
import {
  createContactController,
  deleteContactController,
  getContactByIdController,
  getContactsController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactsSchema,
  updateContactsSchema,
} from '../validation/contacts.js';
import validateMongoId from '../middlewares/validateMongoId.js';
import { authenticate } from '../middlewares/authenticate.js';
import { checkRole } from '../middlewares/checkRole.js';

const router = Router();

router.use('/:contactId', validateMongoId('contactId'));

router.use(authenticate);

router.get('/', ctrlWrapper(getContactsController));

router.get('/:contactId', checkRole, ctrlWrapper(getContactByIdController));

router.post(
  '/',
  validateBody(createContactsSchema),
  ctrlWrapper(createContactController),
);

router.patch(
  '/:contactId',
  checkRole,
  validateBody(updateContactsSchema),
  ctrlWrapper(patchContactController),
);

router.delete('/:contactId', checkRole, ctrlWrapper(deleteContactController));

export default router;
