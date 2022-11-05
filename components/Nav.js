import Link from "next/link";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function Nav() {
  const [user, loading] = useAuthState(auth);
  return (
    <nav className=" justify-between items-center py-10 md:flex">
      <Link href="/">
        <button className="text-3xl my-4">Spokesman.Blog</button>
      </Link>
      <ul className="flex items-center gap-10">
        {!user && (
          <Link legacyBehavior href={"/auth/login"}>
            <a className="py-2 px-4 text-sm bg-emerald-500 text-white rounded-lg font-medium ml-8">
              Войти
            </a>
          </Link>
        )}
        {user && (
          <div className="flex items-center gap-6">
            <Link href="/post">
              <button className="font-medium bg-red-400 text-white py-2 px-4 rounded-sm text-sm animate-pulse hover:bg-red-600">
                Опубликовать
              </button>
            </Link>
            <Link href="/dashboard">
              <img
                className="w-12 rounded-full cursor-pointer"
                src={user.photoURL}
              />
            </Link>
          </div>
        )}
      </ul>
    </nav>
  );
}
