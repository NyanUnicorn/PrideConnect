import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  const { name, email } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
      },
    });
    res.status(201).json({
      message: 'User created successfully',
      newUser,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user' });
  }
};

const GET = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.query.email) {
    const { email } = req.query;
    try {
      const user = await prisma.user.findUnique({
        where: { email: String(email) },
      });

      if (user) {
        res.status(200).json({ user });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(500).json({ message: `Error fetching user for ${email}` });
    }
  }

  try {
    const users = await prisma.user.findMany();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

/**
 *  Updates the user's name and/or email via a query string.
 *  Endpoint: PUT /api/users:id
 */
const PUT = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id, name, email } = req.query;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        name,
        email,
      },
    });
    res.status(200).json({ message: 'User updated successfully', updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user' });
  }
};

const DELETE = async (req: NextApiRequest, res: NextApiResponse) => {
  const { id } = req.body;
  try {
    const deletedUser = await prisma.user.delete({
      where: { id: Number(id) },
    });
    res.status(200).json({ message: 'User deleted successfully', deletedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  switch (req.method) {
    case 'POST':
      await POST(req, res);
      break;
    case 'GET':
      await GET(req, res);
      break;
    case 'PUT':
      await PUT(req, res);
      break;
    case 'DELETE':
      await DELETE(req, res);
      break;
    default:
      res.status(405).json({ message: 'Method not allowed' });
  }
};

export default handler;
