import { getConnection } from 'typeorm';

export const db = {
  async clear() {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.synchronize();
  },
};
