import { NextResponse } from "next/server";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

const projectsCollection = collection(db, "projects");

export async function GET() {
  const snapshot = await getDocs(projectsCollection);
  const projects = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return NextResponse.json({ projects });
}


export async function POST(request: Request) {
    const data = await request.json();
    const docRef = await addDoc(collection(db, "projects"), {
      name: data.name,
      description: data.description || "",
      createdAt: new Date(),
      tasks: [],
    });
    return NextResponse.json({ project: { id: docRef.id, ...data } }, { status: 201 });
}
