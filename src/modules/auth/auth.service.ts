import bcrypt from 'bcrypt';
import pool from '../../db';
import { generateToken } from '../../utils/jwt';
import { AppError } from '../../errors/AppError';
import { StatusCodes } from 'http-status-codes';
import { AuthResponse, User } from './auth.interface';

export const signupService = async (userData: any): Promise<User> => {
  const { name, email, password, role } = userData;
  const assignedRole = role === 'maintainer' ? 'maintainer' : 'contributor';

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const queryText = `
    INSERT INTO users (name, email, password, role)
    VALUES ($1, $2, $3, $4)
    RETURNING id, name, email, role, created_at, updated_at
  `;

  try {
    const result = await pool.query(queryText, [name, email, hashedPassword, assignedRole]);
    return result.rows[0];
  } catch (error: any) {
    if (error.code === '23505') {
      throw new AppError(StatusCodes.CONFLICT, 'Email already exists');
    }
    throw new AppError(StatusCodes.INTERNAL_SERVER_ERROR, 'Error creating user');
  }
};

export const loginService = async (credentials: any): Promise<AuthResponse> => {
  const { email, password } = credentials;

  const queryText = 'SELECT * FROM users WHERE email = $1';
  const result = await pool.query(queryText, [email]);
  const user = result.rows[0];

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError(StatusCodes.UNAUTHORIZED, 'Invalid email or password');
  }

  const tokenPayload = {
    id: user.id,
    name: user.name,
    role: user.role,
  };

  const token = generateToken(tokenPayload);

  // Exclude password from the response
  const { password: _, ...userWithoutPassword } = user;

  return {
    token,
    user: userWithoutPassword,
  };
};
