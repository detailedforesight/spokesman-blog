import Message from "../components/Message";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { toast } from "react-toastify";
import {
  arrayUnion,
  getDoc,
  Timestamp,
  updateDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";

export default function Details() {
  const router = useRouter();
  const routeData = router.query;
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);

  const submitMessage = async () => {
    if (!auth.currentUser) return router.push("/auth/login");
    if (!message) {
      toast.error("The message is empty", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      return;
    }
    const docRef = doc(db, "posts", routeData.id);
    await updateDoc(docRef, {
      comments: arrayUnion({
        message,
        avatar: auth.currentUser.photoURL,
        userName: auth.currentUser.displayName,
        time: Timestamp.now(),
      }),
    });
    setMessage("");
  };
  const getComments = async () => {
    const docRef = doc(db, "posts", routeData.id);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setAllMessages(snapshot.data().comments);
    });
    return unsubscribe;
  };
  useEffect(() => {
    if (!router.isReady) return;
    getComments();
  }, [router.isReady]);
  return (
    <div>
      <Message {...routeData}></Message>
      <div className="my-4 font-mulish">
        <div className="flex">
          <input
            onChange={(e) => setMessage(e.target.value)}
            className="bg-gray-800 w-full p-2 text-white text-sm rounded-lg"
            type="text"
            value={message}
            placeholder="Напишите комментарий"
          ></input>
          <button
            onClick={submitMessage}
            className=" text-white py-2 px-4 text-sm bg-violet-500 hover:bg-violet-600 active:bg-violet-700 rounded-lg"
          >
            Отправить
          </button>
        </div>
        <div className="py-6">
          <h2 className="font-bold text-lg">Комментарии</h2>
          {allMessages?.map((message) => (
            <div
              className="bg-white p-4  my-2 border-2 ml-10 mr-10"
              key={message.time}
            >
              <div className="flex items-center gap-2 mb-4">
                <img
                  className="w-10 rounded-full"
                  src={message.avatar}
                  alt=""
                />
                <h2>{message.userName}</h2>
              </div>
              <h4 className="">{message.message}</h4>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
