import { hash } from 'bcryptjs';
export const saltAndHashPassword = async (password: string) => {
  return await hash(password, 10);
};
