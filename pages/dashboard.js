import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  collection,
  query,
  onSnapshot,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { BsTrash2Fill } from "react-icons/bs";
import Message from "../components/Message";
import { AiFillEdit } from "react-icons/ai";

export default function Dashboard() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);

  const getData = async () => {
    if (loading) return;
    if (!user) return route.push("/auth/login");
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, where("user", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  };

  const deletePost = async (id) => {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
  };
  useEffect(() => {
    getData();
  }, [user, loading]);

  return (
    <div className="font-mulish">
      <h1 className="text-2xl font-bold my-4 ">Ваши посты</h1>
      <div>
        {posts.map((post) => {
          return (
            <Message key={post.id} {...post}>
              <div className="flex gap-4">
                <Link href={{ pathname: "/post", query: post }}>
                  <button className="text-lime-700 flex items-center justify-center gap-2 py-2 text-sm hover:animate-bounce">
                    <AiFillEdit className="text-2xl" />
                    Редактировать
                  </button>
                </Link>
                <button
                  onClick={() => deletePost(post.id)}
                  className="text-red-700 flex items-center justify-center gap-2 py-2 text-sm hover:animate-ping "
                >
                  <BsTrash2Fill className="text-2xl" />
                  Удалить
                </button>
              </div>
            </Message>
          );
        })}
      </div>
      <button
        className="font-medium text-white bg-gray-800 py-2 px-4 my-6"
        onClick={() => auth.signOut()}
      >
        Выйти из профиля
      </button>
    </div>
  );
}
