import Joi from 'joi';

export const createContactsSchema = Joi.object({
    name: Joi.string().min(3).max(20).required(),
    phoneNumber: Joi.string().min(3).max(20).required(),
    email: Joi.string().min(3).max(20).email(),
    isFavourite: Joi.boolean().default(false),
    contactType: Joi.string().min(3).max(20).valid('work', 'home', 'personal'),
});

export const updateContactsSchema = Joi.object({
    name: Joi.string().min(3).max(20),
    phoneNumber: Joi.string().min(3).max(20),
    email: Joi.string().min(3).max(20).email(),
    isFavourite: Joi.boolean().default(false),
    contactType: Joi.string().min(3).max(20).valid('work', 'home', 'personal'),
});
