"use server";

import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function requireUser(callbackUrl: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }
  return session.user.id;
}

export async function addToCart(formData: FormData) {
  const productId = String(formData.get("productId") ?? "");
  const callbackUrl = String(formData.get("callbackUrl") ?? "/catalog");
  const userId = await requireUser(callbackUrl);

  await prisma.cartItem.upsert({
    where: { userId_productId: { userId, productId } },
    create: { userId, productId, quantity: 1 },
    update: { quantity: { increment: 1 } }
  });

  revalidatePath(callbackUrl);
  revalidatePath("/cart");
}

export async function toggleFavorite(formData: FormData) {
  const productId = String(formData.get("productId") ?? "");
  const callbackUrl = String(formData.get("callbackUrl") ?? "/catalog");
  const userId = await requireUser(callbackUrl);

  const current = await prisma.favorite.findUnique({
    where: { userId_productId: { userId, productId } }
  });

  if (current) {
    await prisma.favorite.delete({ where: { id: current.id } });
  } else {
    await prisma.favorite.create({ data: { userId, productId } });
  }

  revalidatePath(callbackUrl);
  revalidatePath("/favorites");
}

export async function changeCartQuantity(formData: FormData) {
  const itemId = String(formData.get("itemId") ?? "");
  const direction = String(formData.get("direction") ?? "plus");
  const userId = await requireUser("/cart");

  const item = await prisma.cartItem.findFirst({ where: { id: itemId, userId } });
  if (!item) return;

  if (direction === "minus" && item.quantity <= 1) {
    await prisma.cartItem.delete({ where: { id: item.id } });
  } else {
    await prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity: { increment: direction === "minus" ? -1 : 1 } }
    });
  }

  revalidatePath("/cart");
}

export async function removeCartItem(formData: FormData) {
  const itemId = String(formData.get("itemId") ?? "");
  const userId = await requireUser("/cart");

  await prisma.cartItem.deleteMany({ where: { id: itemId, userId } });
  revalidatePath("/cart");
}

export async function registerUser(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "").toLowerCase().trim();
  const password = String(formData.get("password") ?? "");

  if (!email || password.length < 6) {
    redirect("/register?error=invalid");
  }

  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) {
    redirect("/register?error=exists");
  }

  await prisma.user.create({
    data: {
      name,
      email,
      passwordHash: await bcrypt.hash(password, 12)
    }
  });

  redirect("/login?registered=1");
}
