const contacts = require(`../models/contacts`);
const { httpError } = require(`../helpers`);

//
const Joi = require(`joi`);
const addSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().required(),
  phone: Joi.string().required(),
});
//
const listContacts = async (req, res, next) => {
  try {
    const result = await contacts.listContacts();

    if (!result) {
      throw httpError(404, `Not found`);
    }
    res.json(result);
  } catch (error) {}
};
//

const getContactById = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contacts.getContactById(contactId);
    if (!result) {
      throw httpError(404, `Not found`);
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};
//

const addContact = async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw httpError(400, error.message);
    }
    const result = await contacts.addContact(req.body);
    if (!result) {
      throw httpError(404, `Not found`);
    }
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
//
const removeContact = async (req, res, next) => {
  try {
    const { contactId } = req.params;
    const result = await contacts.removeContact(contactId);
    if (!result) {
      throw httpError(404, `Not found`);
    }
    res.json({ message: `Delete succes` });
  } catch (error) {
    next(error);
  }
};
//
const updateContact = async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw httpError(400, error.message);
    }
    const { contactId } = req.params;
    const result = await contacts.updateContact(contactId, req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
};
