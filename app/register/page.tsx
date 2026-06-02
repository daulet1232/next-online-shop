import Link from "next/link";
import { registerUser } from "@/app/actions";

export default function RegisterPage() {
  return (
    <section className="auth-page container">
      <div>
        <span className="eyebrow">Аккаунт</span>
        <h1>Регистрация</h1>
        <p>Создай аккаунт, чтобы корзина, избранное и заказы сохранялись в БД.</p>
      </div>
      <form className="auth-form" action={registerUser}>
        <label>
          Имя
          <input name="name" placeholder="Даулет" />
        </label>
        <label>
          Email
          <input name="email" type="email" placeholder="you@example.com" required />
        </label>
        <label>
          Пароль
          <input name="password" type="password" placeholder="Минимум 6 символов" required />
        </label>
        <button className="button button--primary" type="submit">
          Зарегистрироваться
        </button>
        <Link href="/login">Уже есть аккаунт</Link>
      </form>
    </section>
  );
}
