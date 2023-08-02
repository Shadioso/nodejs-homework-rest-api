const Contact = require(`../models/contact`);
const { httpError } = require(`../helpers`);
const { addSchema, updateFavoriteSchema } = require(`../helpers/joiContacts`);

const listContacts = async (req, res, next) => {
  try {
    const { _id: owner } = req.user;
    const result = await Contact.find({ owner });
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

    const result = await Contact.findById(contactId);
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
    console.log(error);
    if (error) {
      throw httpError(400, error.message);
    }
    const { _id: owner } = req.user;
    const result = await Contact.create({ ...req.body, owner });
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
    const result = await Contact.findByIdAndRemove(contactId);
    if (!result) {
      throw httpError(404, `Not found`);
    }
    res.json({ message: `Delete succes` });
  } catch (error) {
    next(error);
  }
};
// //
const updateContact = async (req, res, next) => {
  try {
    const { error } = addSchema.validate(req.body);
    if (error) {
      throw httpError(400, error.message);
    }
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};
//

const updateStatusContact = async (req, res, next) => {
  try {
    const { error } = updateFavoriteSchema.validate(req.body);
    if (error) {
      throw httpError(400, error.message);
    }
    const { contactId } = req.params;
    const result = await Contact.findByIdAndUpdate(contactId, req.body, {
      new: true,
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  listContacts,
  getContactById,
  addContact,
  updateStatusContact,
  removeContact,
  updateContact,
};
