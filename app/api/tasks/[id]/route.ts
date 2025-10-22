import { NextResponse } from "next/server";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const data = await request.json();
  const taskRef = doc(db, "tasks", id);

  const updateData: any = {};
  if (data.title) updateData.title = data.title;
  if (data.status) updateData.status = data.status;
  if (data.projectId) updateData.projectId = data.projectId;
  if (data.dueDate) updateData.dueDate = data.dueDate;

  await updateDoc(taskRef, updateData);

  return NextResponse.json({ task: { id, ...updateData } });
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const taskRef = doc(db, "tasks", id);
  await deleteDoc(taskRef);
  return NextResponse.json({ id });
}
