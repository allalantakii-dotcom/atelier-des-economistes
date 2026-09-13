import { BarChart3 } from "lucide-react";

export default function Logo({ light=false }: { light?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`relative flex h-11 w-11 items-end justify-center rounded-xl ${light ? "bg-white/10" : "bg-maroc.green/10"} p-2`}>
        <BarChart3 className={light ? "text-white" : "text-maroc.green"} size={28}/>
        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-maroc.red"/>
      </div>
      <div className="leading-tight">
        <div className={`font-serif text-xl font-black ${light ? "text-white" : "text-slate-900"}`}>L’Atelier</div>
        <div className={`font-serif text-xl font-black -mt-1 ${light ? "text-white" : "text-maroc.red"}`}>des Économistes</div>
        <div className={`text-[8px] font-semibold tracking-[.22em] ${light ? "text-white/60" : "text-slate-500"}`}>APPRENDRE · PROGRESSER · RÉUSSIR</div>
      </div>
    </div>
  );
}