const fs = require(`fs/promises`);
const path = require(`path`);
const { v4: uuidv4 } = require("uuid");

const contactsPath = path.join(`models`, `contacts.json`);

//Отримуємо всі книги
const listContacts = async () => {
  const data = await fs.readFile(contactsPath);
  return JSON.parse(data);
};
listContacts();
// Отримуємо книги по id
const getContactById = async (contactId) => {
  const contacts = await listContacts();
  const result = contacts.find((contact) => contact.id === contactId);
  if (result === -1) {
    return null;
  }
  return result;
};
// Додаємо контакт
const addContact = async (data) => {
  const contacts = await listContacts();
  const newContact = {
    id: uuidv4(),
    ...data,
  };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
};

//   Видаляємо контакт
const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  const [result] = contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return result;
};
// Редагуємо контакт
const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const index = contacts.findIndex((contact) => contact.id === contactId);
  if (index === -1) {
    return null;
  }
  contacts[index] = { id: contactId, ...body };
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return contacts[index];
};
//
module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};
