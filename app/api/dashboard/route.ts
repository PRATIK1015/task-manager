import { NextResponse } from "next/server";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET() {
  try {
    const usersSnap = await getDocs(collection(db, "users"));
    const usersCount = usersSnap.size;

    const projectsSnap = await getDocs(collection(db, "projects"));
    const projects = await Promise.all(
      projectsSnap.docs.map(async (projDoc) => {
        const projectId = projDoc.id;
        const projectData = projDoc.data();
        
        const tasksQuery = query(collection(db, "tasks"), where("projectId", "==", projectId));
        const tasksSnap = await getDocs(tasksQuery);
        const tasks = tasksSnap.docs.map((t) => t.data());

        const todo = tasks.filter((t) => t.status === "Todo").length;
        const inProcess = tasks.filter((t) => t.status === "InProgress").length;
        const completed = tasks.filter((t) => t.status === "Completed").length;

        return {
          id: projectId,
          name: projectData.name,
          totalTask: tasks.length,
          todo,
          inProcess,
          completed,
        };
      })
    );

    return NextResponse.json(
      {
        users: usersCount,
        projects,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Dashboard API error:", error);
    return NextResponse.json({ error: "Failed to fetch dashboard data" }, { status: 500 });
  }
}