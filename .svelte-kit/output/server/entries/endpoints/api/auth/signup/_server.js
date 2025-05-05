import { j as json } from "../../../../../chunks/index.js";
import bcrypt from "bcrypt";
import { p as prisma } from "../../../../../chunks/client.js";
async function POST({ request }) {
  const { email, username, password } = await request.json();
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) return json({ error: "User already exists" }, { status: 400 });
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { email, username, password: hashedPassword }
  });
  return json({
    message: "User created",
    user: { id: user.id, email: user.email, username: user.username }
  });
}
export {
  POST
};
