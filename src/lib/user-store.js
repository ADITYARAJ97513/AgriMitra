
import bcrypt from 'bcryptjs';

// In-memory store for users. In a real app, this would be a database.
// To prevent the store from being cleared on hot-reloads in development,
// we attach it to the global object. This is a common pattern.
const globalForUsers = globalThis;
const users = globalForUsers.users || (globalForUsers.users = []);


export async function findUserByUsername(username) {
  return users.find(user => user.username === username);
}

export async function createUser({ username, password }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: Date.now().toString(),
    username,
    password: hashedPassword,
  };
  users.push(newUser);
  return newUser;
}

export async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}
