import { NextResponse } from "next/server";
import { doc, getDoc, collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = params.id;

    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const projectRef = doc(db, "projects", projectId);
    const projectSnap = await getDoc(projectRef);

    if (!projectSnap.exists()) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const tasksQuery = query(collection(db, "tasks"), where("projectId", "==", projectId));
    const snapshot = await getDocs(tasksQuery);

    const tasks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(
      {
        project: {
          id: projectSnap.id,
          ...projectSnap.data(),
        },
        tasks,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
  }
}
