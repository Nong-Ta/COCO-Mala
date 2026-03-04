import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function loginAdmin(reqBody: {
  username: string;
  phone: string;
  password: string;
}) {
  try {
    const { username, phone, password } = reqBody;

    const admin = await prisma.admin.findFirst({
      where: {
        username,
        phone,
      },
    });

    if (!admin) {
      return { success: false, message: "ข้อมูลไม่ถูกต้อง" };
    }

    if (admin.password !== password) {
      return { success: false, message: "ข้อมูลไม่ถูกต้อง" };
    }

    return {
      success: true,
      adminId: admin.id,
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "เกิดข้อผิดพลาดของระบบ" };
  } finally {
    await prisma.$disconnect();
  }
}
