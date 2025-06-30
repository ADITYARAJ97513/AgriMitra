
import bcrypt from 'bcryptjs';

// In-memory store for users. In a real app, this would be a database.
const users = [];

export async function findUserByEmail(email) {
  return users.find(user => user.email === email);
}

export async function createUser({ email, password }) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    id: Date.now().toString(),
    email,
    password: hashedPassword,
  };
  users.push(newUser);
  return newUser;
}

export async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}
