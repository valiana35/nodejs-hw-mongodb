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
import { ROLE } from '../constants/constans.js';
import { checkRoles } from '../middlewares/checkRoles.js';

const router = Router();

router.use('/:contactId', validateMongoId('contactId'));

router.get(authenticate);

router.get('/', checkRoles(ROLE.USER), ctrlWrapper(getContactsController));

router.get('/:contactId', checkRoles(ROLE.USER), ctrlWrapper(getContactByIdController));

router.post(
  '/',
  checkRoles(ROLE.USER),
  validateBody(createContactsSchema),
  ctrlWrapper(createContactController),
);

router.patch(
  '/:contactId',
  checkRoles(ROLE.USER),
  validateBody(updateContactsSchema),
  ctrlWrapper(patchContactController),
);

router.delete('/:contactId', checkRoles(ROLE.USER), ctrlWrapper(deleteContactController));

export default router;
