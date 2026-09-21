"use client";

import {
  ControlBar,
  GridLayout,
  LiveKitRoom,
  ParticipantTile,
  RoomAudioRenderer,
  useDataChannel,
  useParticipants,
  useTracks,
} from "@livekit/components-react";
import { DataPublishOptions, Track } from "livekit-client";
import { Hand, Mic2, ShieldCheck, Users, Video } from "lucide-react";
import { useMemo, useState } from "react";
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

function RoomControls({ role, identity }: Pick<ClassroomRoomProps, "role" | "identity">) {
  const participants = useParticipants();
  const tracks = useTracks([
    { source: Track.Source.Camera, withPlaceholder: true },
    { source: Track.Source.ScreenShare, withPlaceholder: false },
  ]);
  const [handRaised, setHandRaised] = useState(false);
  const [hands, setHands] = useState<HandRequest[]>([]);
  const { send } = useDataChannel("classroom-controls", (message) => {
    try {
      const request = JSON.parse(new TextDecoder().decode(message.payload)) as HandRequest;
      setHands((current) => [
        ...current.filter((item) => item.identity !== request.identity),
        ...(request.raised ? [request] : []),
      ]);
    } catch {
      // Ignore malformed classroom control messages.
    }
  });

  const publishOptions: DataPublishOptions = { reliable: true };
  const publishHandState = async (raised: boolean) => {
    setHandRaised(raised);
    await send(new TextEncoder().encode(JSON.stringify({ identity, raised })), publishOptions);
  };

  const studentCount = useMemo(
    () => participants.filter((participant) => participant.identity !== identity).length,
    [identity, participants],
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-3 text-sm text-slate-600">
          <span className="flex items-center gap-2 font-bold text-slate-900"><Users size={17} /> {studentCount} participants</span>
          <span className="hidden h-4 w-px bg-slate-200 sm:block" />
          <span className="flex items-center gap-2"><ShieldCheck size={16} className="text-maroc.green" /> Room protected</span>
        </div>
        {role === "student" ? (
          <button
            type="button"
            onClick={() => publishHandState(!handRaised)}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-extrabold transition ${handRaised ? "bg-maroc.red text-white" : "bg-slate-100 text-slate-800 hover:bg-slate-200"}`}
          >
            <Hand size={16} /> {handRaised ? "Lower hand" : "Raise hand"}
          </button>
        ) : (
          <div className="flex items-center gap-2 text-sm font-bold text-maroc.green"><Mic2 size={16} /> Teacher controls active</div>
        )}
      </div>

      {role === "teacher" && (
        <div className="rounded-2xl border border-maroc.red/15 bg-maroc.red/5 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div><h2 className="font-black text-slate-900">Questions queue</h2><p className="text-xs text-slate-500">Approve students one at a time.</p></div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-black text-maroc.red">{hands.length} raised</span>
          </div>
          {hands.length === 0 ? <p className="text-sm text-slate-500">No raised hands yet.</p> : <div className="flex flex-wrap gap-2">{hands.map((hand) => <button key={hand.identity} type="button" onClick={() => publishHandState(false)} className="rounded-xl bg-white px-3 py-2 text-sm font-bold text-slate-800 shadow-sm">Allow {hand.identity} to speak</button>)}</div>}
        </div>
      )}

      <div className="rounded-3xl bg-slate-950 p-3 shadow-2xl">
        <GridLayout tracks={tracks}>
          <div className="grid h-full grid-cols-1 gap-3 sm:grid-cols-2">
            {tracks.map((track) => <ParticipantTile key={`${track.participant.identity}-${track.source}`} trackRef={track} />)}
          </div>
        </GridLayout>
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