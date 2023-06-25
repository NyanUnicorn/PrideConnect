import { NextRequest, NextResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const createUser = async (req: NextRequest, res: NextResponse) => {
  const { name, email } = req.body;
  try {
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
      },
    });
    res.status(201).json({
      message: "User created successfully",
      newUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Error creating user" });
  }
};

const getUsers = async (req: NextRequest, res: NextResponse) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json({ users });
  } catch (error) {
    res.status(500).json({ message: "Error fetching users" });
  }
};

/**
 *  Updates the user's name and/or email via a query string.
 *  Endpoint: PUT /api/users:id
 */
const updateUser = async (req: NextRequest, res: NextResponse) => {
  const { id, name, email } = req.query;
  try {
    const updatedUser = await prisma.user.update({
      where: { id: Number(id) },
      data: {
        name,
        email,
      },
    });
    res.status(200).json({ message: "User updated successfully", updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Error updating user" });
  }
};

const deleteUser = async (req: NextRequest, res: NextResponse) => {
  const { id } = req.body;
  try {
    const deletedUser = await prisma.user.delete({
      where: { id: Number(id) },
    });
    res.status(200).json({ message: "User deleted successfully", deletedUser });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};

const handler = (req: NextRequest, res: NextResponse) => {
  switch (req.method) {
    case "POST":
      return createUser(req, res);
    case "GET":
      return getUsers(req, res);
    case "PUT":
      return updateUser(req, res);
    case "DELETE":
      return deleteUser(req, res);
    default:
      return res.status(405).send("Method not allowed");
  }
};

export default handler;
