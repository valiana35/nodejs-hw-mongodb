import { Contact } from '../db/contact.js';

export const getAllContacts = async () => {
  const contacts = await Contact.find();
  return contacts;
};

export const getContactById = async (contactId) => {
  const contact = await Contact.findById(contactId);
  return contact;
};

export const createContact = async ({
  name,
  phoneNumber,
  email,
  isFavourite,
  contactType,
}) => {
  const contact = await Contact.create({
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
  });
  return contact;
};

export const updateContact = async (contactId, {
  name,
  phoneNumber,
  email,
  isFavourite,
  contactType,
}) => {
  const rawResult = await Contact.findOneAndUpdate({ id: contactId }, {
    name,
    phoneNumber,
    email,
    isFavourite,
    contactType,
  }, {
    new: true,
    includeResultMetadata: true,
  });
  if (!rawResult || !rawResult.value) return null;
  return {
    student: rawResult.value,
    isNew: Boolean(rawResult?.lastErrorObject?.upserted),
  };
};

export const deleteContact = async (contactId) => {
  const contact = await Contact.findOneAndDelete({
    _id: contactId,
  });
  return contact;
};
