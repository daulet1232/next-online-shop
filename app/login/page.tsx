import { Suspense } from "react";
import { LoginForm } from "@/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <section className="auth-page container">
      <div>
        <span className="eyebrow">Аккаунт</span>
        <h1>Вход</h1>
        <p>Войди, чтобы добавлять товары в корзину, избранное и оформлять заказы.</p>
      </div>
      <Suspense>
        <LoginForm />
      </Suspense>
    </section>
  );
}
