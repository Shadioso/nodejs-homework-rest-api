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

// //

module.exports = router;

// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0Y2E0M2E4ZTdhMTI0MzIwNmVhMjk4ZiIsImlhdCI6MTY5MDk3NzM0NywiZXhwIjoxNjkxMDYwMTQ3fQ.03pgP0xPHti9_7Xz58s9HZ0scICM9T3XxBUcfmpbP2Q
