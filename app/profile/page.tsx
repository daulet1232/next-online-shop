import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/login?callbackUrl=/profile");

  const orders = await prisma.order.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    take: 5
  });

  return (
    <section className="profile-page container">
      <div className="profile-hero">
        <div className="avatar">{session.user.name?.[0] ?? session.user.email?.[0] ?? "U"}</div>
        <div>
          <span className="eyebrow">Профиль</span>
          <h1>{session.user.name ?? "Покупатель"}</h1>
          <p>{session.user.email}</p>
        </div>
      </div>
      <div className="profile-panel">
        <h2>История заказов</h2>
        {orders.length ? (
          orders.map((order) => (
            <div className="profile-row" key={order.id}>
              <span>Заказ #{order.id.slice(-6)}</span>
              <strong>{order.status}</strong>
            </div>
          ))
        ) : (
          <p>Заказов пока нет.</p>
        )}
      </div>
    </section>
  );
}
