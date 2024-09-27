const express = require("express");
const router = express.Router();
const { contacts } = require(`../../controlers`);
const { isValidId, authenticate } = require(`../../helpers`);
// //
router.get("/", authenticate, contacts.listContacts);
// //
router.get("/:contactId", authenticate, isValidId, contacts.getContactById);
// //
router.post("/", authenticate, contacts.addContact);
// //
router.delete("/:contactId", authenticate, isValidId, contacts.removeContact);
// //
router.put("/:contactId", authenticate, isValidId, contacts.updateContact);
//
router.patch(
  "/:contactId/favorite ",
  authenticate,
  isValidId,
  contacts.updateStatusContact
);

//

module.exports = router;
