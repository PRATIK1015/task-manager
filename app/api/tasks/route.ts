import { NextResponse } from "next/server";
import {
  collection,
  addDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

const tasksCollection = collection(db, "tasks");

export async function POST(request: Request) {
  const data = await request.json();
  const docRef = await addDoc(tasksCollection, {
    title: data.title,
    status: data.status || "Todo",
    projectId: data.projectId || "",
    createdAt: new Date(),
  });

  return NextResponse.json(
    {
      task: {
        id: docRef.id,
        title: data.title,
        status: data.status || "Todo",
        projectId: data.projectId || "",
        createdAt: new Date(),
      },
    },
    { status: 201 }
  );
}
