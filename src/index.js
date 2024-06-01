import { initMongoConnection } from './db/initMongoConnection.js';
import { setupServer } from './server.js';

const getContacts = async() => {
  await initMongoConnection();
  setupServer();
}

getContacts();
