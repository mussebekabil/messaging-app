import { executeQuery } from "./database.js";


/**
 * User related queries
 */
export const getAllUsers = async () => {
  const result =   await executeQuery(
    "SELECT * FROM users;"
  );

  return result.rows;
};

export const getUserById = async (userId) => {
  const result =   await executeQuery(
    "SELECT * FROM users WHERE id=$userId;",
    { userId },
  );

  return result.rows;
};

export const saveUser = async (userId) => {
  await executeQuery(
    "INSERT INTO users (id) VALUES ($userId);",
    { userId },
  );
};
