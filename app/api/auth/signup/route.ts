import { NextResponse } from "next/server";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export async function POST(req: Request) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    if (name) await updateProfile(user, { displayName: name });

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      name: name || "",
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ uid: user.uid, email: user.email, name: user.displayName || name });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Something went wrong" }, { status: 500 });
  }
}
