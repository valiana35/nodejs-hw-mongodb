import createHttpError from 'http-errors';
import { ROLE } from '../constants/constans.js';
import { Contact } from '../db/contact.js';

export const checkRoles =
  (...roles) =>
  async (req, res, next) => {
    const { user } = req;
    if (!user) {
      next(createHttpError(401));
      return;
    }

    const { role } = user;
    if (roles.includes(ROLE.USER) && role === ROLE.USER) {
      const { contactId } = req.params;
      if (!contactId) {
        next(
          createHttpError(
            403,
            'You do not have permission to access this contact!',
          ),
        );
        return;
      }
      const contact = await Contact.findOne({
        _id: contactId,
        userId: user._id,
      });
      if (contact) {
        next();
        return;
      }
    }
    next(
      createHttpError(
        403,
        'You do not have permission to access this contact!',
      ),
    );
  };
