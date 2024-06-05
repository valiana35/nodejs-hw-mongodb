import { Router } from 'express';
import {
  createContactController,
  getContactByIdController,
  getContactsController,
} from '../controllers/contacts';
import { ctrlWrapper } from '../utils/ctrlWrapper';

const contactsRouter = Router();

contactsRouter.get('/contacts', ctrlWrapper(getContactsController));

contactsRouter.get(
  '/contacts/:contactId',
  ctrlWrapper(getContactByIdController),
);

contactsRouter.post('/contacts', ctrlWrapper(createContactController));

export default contactsRouter;
