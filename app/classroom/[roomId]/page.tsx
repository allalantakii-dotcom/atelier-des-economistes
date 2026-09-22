import ClassroomRoom from "@/components/ClassroomRoom";

type ClassroomPageProps = {
  params: Promise<{ roomId: string }>;
  searchParams: Promise<{ identity?: string; role?: string }>;
};

export default async function ClassroomPage({ params, searchParams }: ClassroomPageProps) {
  const { roomId } = await params;
  const query = await searchParams;
  const role = query.role === "teacher" ? "teacher" : "student";
  const identity = query.identity?.trim() || (role === "teacher" ? "teacher-demo" : "student-demo");

  return (
    <main className="immersive-page">
      <ClassroomRoom room={roomId} identity={identity} role={role} />
    </main>
  );
}