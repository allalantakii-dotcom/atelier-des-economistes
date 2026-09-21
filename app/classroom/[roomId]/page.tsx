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
    <main className="min-h-screen bg-[#f8f5f0] px-4 py-6 sm:px-6 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-xs font-black uppercase tracking-[0.2em] text-maroc.red">Live classroom</p><h1 className="mt-2 text-3xl font-black text-slate-950">Économie · Groupe A</h1><p className="mt-1 text-sm text-slate-500">Room: {roomId}</p></div>
          <div className="rounded-xl bg-white px-4 py-3 text-right shadow-sm"><p className="text-xs font-bold uppercase tracking-wider text-slate-400">{role} access</p><p className="text-sm font-black text-slate-800">{identity}</p></div>
        </header>
        <ClassroomRoom room={roomId} identity={identity} role={role} />
      </div>
    </main>
  );
}