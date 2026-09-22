"use client";

import {
  ControlBar,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useDataChannel,
  useParticipants,
  useTracks,
} from "@livekit/components-react";
import { DataPublishOptions, Track } from "livekit-client";
import { Hand, Lightbulb, Mic2, ShieldCheck, Sparkles, Users, Video } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import "@livekit/components-styles";

type ClassroomRoomProps = {
  room: string;
  identity: string;
  role: "student" | "teacher";
};

type HandRequest = {
  identity: string;
  raised: boolean;
};

type ClassroomMessage =
  | { type: "hand"; identity: string; raised: boolean }
  | { type: "understood"; identity: string; understood: boolean };

const seats = Array.from({ length: 50 }, (_, index) => index + 1);

function participantRole(participant: { metadata?: string }) {
  try {
    return JSON.parse(participant.metadata || "{}").role as string | undefined;
  } catch {
    return undefined;
  }
}

function RoomControls({ role, identity }: Pick<ClassroomRoomProps, "role" | "identity">) {
  const participants = useParticipants();
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
    { source: Track.Source.ScreenShare, withPlaceholder: false },
  ]);
  const [handRaised, setHandRaised] = useState(false);
  const [hands, setHands] = useState<HandRequest[]>([]);
  const [understood, setUnderstood] = useState<Record<string, boolean>>({});
  const { send } = useDataChannel("classroom-controls", (message) => {
    try {
      const request = JSON.parse(new TextDecoder().decode(message.payload)) as ClassroomMessage;
      if (request.type === "hand") {
        setHands((current) => [
          ...current.filter((item) => item.identity !== request.identity),
          ...(request.raised ? [{ identity: request.identity, raised: true }] : []),
        ]);
      }
      if (request.type === "understood") {
        setUnderstood((current) => ({ ...current, [request.identity]: request.understood }));
      }
    } catch {
      // Ignore malformed classroom control messages.
    }
  });

  const publishOptions: DataPublishOptions = { reliable: true };
  const publishMessage = async (message: ClassroomMessage) => {
    await send(new TextEncoder().encode(JSON.stringify(message)), publishOptions);
  };
  const publishHandState = async (raised: boolean) => {
    setHandRaised(raised);
    await publishMessage({ type: "hand", identity, raised });
  };
  const publishUnderstood = async (value: boolean) => {
    setUnderstood((current) => ({ ...current, [identity]: value }));
    await publishMessage({ type: "understood", identity, understood: value });
  };

  useEffect(() => {
    if (role !== "student") return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "1") void publishUnderstood(true);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [role, identity]);

  const students = useMemo(
    () => participants.filter((participant) => participantRole(participant) !== "teacher"),
    [participants],
  );
  const teacherTrack = tracks.find((track) => participantRole(track.participant) === "teacher");

  return (
    <div className="classroom-scene space-y-4">
      <div className="classroom-statusbar">
        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
          <span className="flex items-center gap-2 font-black text-slate-900"><Users size={17} /> {students.length}/50 students</span>
          <span className="hidden h-4 w-px bg-slate-200 sm:block" />
          <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-maroc.green" /> Secure classroom</span>
        </div>
        {role === "student" ? (
          <div className="flex flex-wrap items-center gap-2">
            <button type="button" onClick={() => void publishUnderstood(!understood[identity])} className={`classroom-control ${understood[identity] ? "is-understood" : ""}`}><Lightbulb size={16} /> {understood[identity] ? "Understood" : "I understand"}</button>
            <button type="button" onClick={() => void publishHandState(!handRaised)} className={`classroom-control ${handRaised ? "is-raised" : ""}`}><Hand size={16} /> {handRaised ? "Lower hand" : "Raise hand"}</button>
          </div>
        ) : <div className="flex items-center gap-2 text-sm font-black text-maroc.green"><Mic2 size={16} /> Teacher controls active</div>}
      </div>

      {role === "teacher" && (
        <div className="question-queue">
          <div className="mb-3 flex items-center justify-between"><div><h2 className="font-black text-slate-900">Questions queue</h2><p className="text-xs text-slate-500">Approve students one at a time.</p></div><span className="rounded-full bg-white px-3 py-1 text-xs font-black text-maroc.red">{hands.length} raised</span>
          </div>
          {hands.length === 0 ? <p className="text-sm text-slate-500">No raised hands yet.</p> : <div className="flex flex-wrap gap-2">{hands.map((hand) => <button key={hand.identity} type="button" onClick={() => void publishMessage({ type: "hand", identity: hand.identity, raised: false })} className="rounded-xl bg-white px-3 py-2 text-sm font-bold text-slate-800 shadow-sm">Allow {hand.identity} to speak</button>)}</div>}
        </div>
      )}

      <div className="theatre-floor">
        <div className="teacher-stage">
          <div className="stage-label"><Sparkles size={15} /> Teacher stage</div>
          <div className="teacher-video">
            {teacherTrack ? <ParticipantTile trackRef={teacherTrack} /> : <div className="teacher-placeholder"><Video size={28} /><span>Teacher camera will appear here</span></div>}
          </div>
          <div className="stage-desk"><span /> <b>ATELIER DES ÉCONOMISTES</b> <span /></div>
        </div>
        <div className="seat-legend"><span><i className="seat-dot occupied" /> Connected</span><span><i className="seat-dot understood" /> Understood</span><span><i className="seat-dot raised" /> Hand raised</span></div>
        <div className="student-seating" aria-label="50 student seats">
          {seats.map((seatNumber) => {
            const student = students[seatNumber - 1];
            const studentId = student?.identity;
            const isCurrent = studentId === identity;
            return <div key={seatNumber} className={`student-seat ${studentId ? "occupied" : "empty"} ${isCurrent ? "current" : ""}`}><div className="seat-number">{String(seatNumber).padStart(2, "0")}</div><div className="student-avatar">{studentId ? (understood[studentId] ? <Lightbulb size={16} /> : studentId.slice(0, 2).toUpperCase()) : ""}{studentId && hands.some((hand) => hand.identity === studentId) && <span className="raised-avatar"><Hand size={13} /></span>}</div><span className="student-name">{student ? (student.name || student.identity) : "Available seat"}</span>{studentId && understood[studentId] && <span className="understood-light" title="Understood" />}</div>;
          })}
        </div>
        <div className="aisle-label">Student seating · 50 places</div>
      </div>

      <div className="livekit-controls">
        <ControlBar controls={{ microphone: true, camera: true, screenShare: role === "teacher", chat: false }} />
        <RoomAudioRenderer />
      </div>
    </div>
  );
}

export default function ClassroomRoom({ room, identity, role }: ClassroomRoomProps) {
  const [token, setToken] = useState<string>();
  const [serverUrl, setServerUrl] = useState<string>();
  const [error, setError] = useState<string>();

  if (!token || !serverUrl) {
    return (
      <div className="relative z-10 rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-maroc.green/10 text-maroc.green"><Video /></div>
        <h1 className="mt-5 text-2xl font-black text-slate-950">{role === "teacher" ? "Ready to start class?" : "Ready to join class?"}</h1>
        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">{role === "teacher" ? "Start the live room and manage microphones, cameras, and student questions." : "Allow camera and microphone access when your browser asks. Your teacher controls who can speak."}</p>
        {error && <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-700">{error}</p>}
        <button type="button" aria-label={role === "teacher" ? "Start class" : "Join class"} onClick={async () => { setError(undefined); const response = await fetch("/api/livekit/token", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ room, identity, role }) }); const result = await response.json(); if (!response.ok) { setError(result.error || "Unable to join the room."); return; } setToken(result.token); setServerUrl(result.url); }} className="classroom-entry-button mt-6 inline-flex min-h-12 min-w-52 items-center justify-center rounded-xl px-7 py-3 font-extrabold shadow-lg transition">{role === "teacher" ? "Start class" : "Join class"}</button>
      </div>
    );
  }

  return <LiveKitRoom token={token} serverUrl={serverUrl} connect video audio options={{ adaptiveStream: true, dynacast: true }}><RoomControls role={role} identity={identity} /></LiveKitRoom>;
}