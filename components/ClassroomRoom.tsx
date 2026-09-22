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
import { BarChart3, Bell, BookOpen, ChevronRight, ClipboardList, FileText, Hand, Home, Lightbulb, MessageCircle, MoreHorizontal, PanelLeft, Send, Settings, Sparkles, Trophy, Users, Video } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import "@livekit/components-styles";

type ClassroomRoomProps = { room: string; identity: string; role: "student" | "teacher" };
type HandRequest = { identity: string; raised: boolean };
type ChatMessage = { id: string; identity: string; message: string; timestamp: string; teacher?: boolean };
type ClassroomMessage =
  | { type: "hand"; identity: string; raised: boolean }
  | { type: "understood"; identity: string; understood: boolean }
  | { type: "chat"; identity: string; message: string };

const seats = Array.from({ length: 50 }, (_, index) => index + 1);
const nav = [[Home, "Accueil"], [BookOpen, "Mes cours"], [FileText, "Ressources"], [ClipboardList, "Évaluations"], [MessageCircle, "Chat"]] as const;
const sidebar = [[PanelLeft, "Tableau de bord"], [Video, "Cours en direct"], [FileText, "Supports de cours"], [ClipboardList, "Exercices & Quiz"], [BarChart3, "Travaux"], [Trophy, "Classement"], [MessageCircle, "Messages"], [Settings, "Paramètres"]] as const;
const demoChats: ChatMessage[] = [
  { id: "1", identity: "Allal Antaki", message: "Bienvenue au chapitre 3. Gardez vos cahiers ouverts.", timestamp: "19:42", teacher: true },
  { id: "2", identity: "Salma", message: "La courbe se déplace vers la droite ?", timestamp: "19:44" },
  { id: "3", identity: "Yassine", message: "Oui, c'est plus clair maintenant.", timestamp: "19:45" },
];

function participantRole(participant: { metadata?: string }) {
  try { return JSON.parse(participant.metadata || "{}").role as string | undefined; } catch { return undefined; }
}

function ImmersiveRoom({ role, identity }: Pick<ClassroomRoomProps, "role" | "identity">) {
  const participants = useParticipants();
  const tracks = useTracks([{ source: Track.Source.Camera, withPlaceholder: true }, { source: Track.Source.ScreenShare, withPlaceholder: false }]);
  const [handRaised, setHandRaised] = useState(false);
  const [understood, setUnderstood] = useState<Record<string, boolean>>({});
  const [hands, setHands] = useState<HandRequest[]>([]);
  const [chats, setChats] = useState(demoChats);
  const [chatInput, setChatInput] = useState("");
  const publishOptions: DataPublishOptions = { reliable: true };
  const { send } = useDataChannel("classroom-controls", (message) => {
    try {
      const event = JSON.parse(new TextDecoder().decode(message.payload)) as ClassroomMessage;
      if (event.type === "hand") setHands((current) => [...current.filter((item) => item.identity !== event.identity), ...(event.raised ? [{ identity: event.identity, raised: true }] : [])]);
      if (event.type === "understood") setUnderstood((current) => ({ ...current, [event.identity]: event.understood }));
      if (event.type === "chat") setChats((current) => [...current, { id: crypto.randomUUID(), identity: event.identity, message: event.message, timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
    } catch { /* Ignore malformed classroom messages. */ }
  });
  const publish = async (event: ClassroomMessage) => send(new TextEncoder().encode(JSON.stringify(event)), publishOptions);
  const students = useMemo(() => participants.filter((participant) => participantRole(participant) !== "teacher"), [participants]);
  const teacherTrack = tracks.find((track) => participantRole(track.participant) === "teacher");
  const toggleHand = async () => { const next = !handRaised; setHandRaised(next); await publish({ type: "hand", identity, raised: next }); };
  const toggleUnderstood = async () => { const next = !understood[identity]; setUnderstood((current) => ({ ...current, [identity]: next })); await publish({ type: "understood", identity, understood: next }); };
  useEffect(() => { if (role !== "student") return; const listener = (event: KeyboardEvent) => { if (event.key === "1") void toggleUnderstood(); }; window.addEventListener("keydown", listener); return () => window.removeEventListener("keydown", listener); }, [role, identity, understood]);
  const sendChat = async (event: FormEvent) => { event.preventDefault(); const message = chatInput.trim(); if (!message) return; setChatInput(""); setChats((current) => [...current, { id: crypto.randomUUID(), identity, message, timestamp: "now" }]); await publish({ type: "chat", identity, message }); };

  return (
    <div className="immersive-classroom">
      <header className="classroom-navbar">
        <div className="classroom-brand"><span className="brand-mark"><BarChart3 size={20} /></span><span><strong>L&apos;Atelier des Économistes</strong><small>Apprendre • Comprendre • Réussir</small></span></div>
        <nav className="classroom-quick-nav">{nav.map(([Icon, label]) => <button key={label} type="button"><Icon size={15} />{label}</button>)}</nav>
        <div className="classroom-account"><button className="icon-button" aria-label="Notifications" type="button"><Bell size={18} /></button><span className="country-badge">🇲🇦</span><span className="profile-avatar">AA</span><span className="profile-copy"><strong>{role === "teacher" ? "Allal Antaki" : identity}</strong><small>{role === "teacher" ? "Professeur" : "Étudiant"}</small></span></div>
      </header>
      <div className="classroom-body">
        <aside className="classroom-sidebar">
          <div className="group-card"><div className="online-line"><span className="online-dot" /> LIVE NOW</div><strong>Groupe 1 - Éco / Compta</strong><span><Users size={14} /> {students.length || 50} étudiants connectés</span></div>
          <div className="sidebar-menu">{sidebar.map(([Icon, label], index) => <button key={label} type="button" className={index === 1 ? "active" : ""}><Icon size={17} /><span>{label}</span>{index === 1 && <span className="live-tag">LIVE</span>}</button>)}</div>
          <div className="quote-card"><Sparkles size={18} className="gold-icon" /><p>&quot;L&apos;économie est l&apos;art de tirer le meilleur parti de la vie.&quot;</p><small>— John Maynard Keynes</small></div>
        </aside>
        <main className="amphitheatre-panel">
          <div className="lesson-header"><div><span className="eyebrow"><span className="live-dot" /> COURS EN DIRECT</span><h1>Économie · Chapitre 3</h1><p>La loi de l&apos;offre et de la demande</p></div><div className="lesson-actions"><span className="elapsed"><span /> 00:45:23</span><button className="icon-button" aria-label="More options" type="button"><MoreHorizontal size={19} /></button></div></div>
          <div className="lecture-hall">
            <div className="wall-plaques"><div>ADAM<br /><small>SMITH</small></div><span>LIBERTÉ<br /><b>ÉCHANGE</b><br />PROSPÉRITÉ</span><div>J.M.<br /><small>KEYNES</small></div></div>
            <div className="presentation-board"><div className="board-top"><span>MACROÉCONOMIE / 03</span><span>● EN DIRECT</span></div><h2>L&apos;offre et la demande</h2><div className="board-content"><div className="supply-chart"><span className="axis-y">Prix</span><span className="axis-x">Quantité</span><div className="curve curve-supply">S</div><div className="curve curve-demand">D</div><span className="equilibrium">E</span></div><div className="board-notes"><p><b>01</b> L&apos;équilibre du marché</p><p><b>02</b> Le prix d&apos;équilibre</p><p><b>03</b> Les déplacements de courbe</p><span className="case-study"><BookOpen size={14} /> Cas pratique · Marché automobile</span></div></div></div>
            <div className="podium"><div className="podium-camera">{teacherTrack ? <ParticipantTile trackRef={teacherTrack} /> : <><Video size={21} /><span>Teacher camera</span></>}</div><div className="podium-front"><BarChart3 size={20} /> ATELIER</div></div>
            <div className="hall-rows">{[0, 1, 2, 3].map((row) => <div className="hall-row" key={row}>{[0, 1, 2, 3, 4, 5, 6].map((column) => { const student = students[row * 7 + column]; const name = student?.identity || ["Yassine", "Oina", "Hamza", "Rayan", "Salma", "Imane", "Nour"][column]; const raised = student && hands.some((hand) => hand.identity === student.identity); const lit = student && understood[student.identity]; return <div className={`hall-seat ${student ? "occupied" : ""}`} key={`${row}-${column}`}><span className="desk-screen" />{student && <span className="seat-avatar">{name.slice(0, 2).toUpperCase()}{raised && <i className="mini-hand"><Hand size={11} /></i>}{lit && <i className="understood-bulb"><Lightbulb size={10} /></i>}</span>}<small>{name}</small></div>; })}</div>)}</div>
          </div>
        </main>
        <aside className="classroom-rightbar">
          <section className="participants-panel"><div className="panel-heading"><div><h2>Participants <span>({students.length || 50})</span></h2><p><span className="online-dot" /> {students.length || 50} en ligne</p></div><button className="icon-button" aria-label="Panel settings" type="button"><Settings size={16} /></button></div><div className="search-student"><Users size={15} /><input placeholder="Rechercher un étudiant..." /></div><div className="participant-list">{students.slice(0, 50).map((student) => <div className="participant-row" key={student.identity}><span className="list-avatar">{student.identity.slice(0, 2).toUpperCase()}</span><span><strong>{student.identity}</strong><small>{understood[student.identity] ? "A compris le concept" : "Dans la salle"}</small></span><span className={`presence-dot ${understood[student.identity] ? "clear" : ""}`} /></div>)}{students.length === 0 && <div className="empty-participants"><Users size={24} /><p>Les étudiants apparaîtront ici</p><small>En attente de connexions...</small></div>}</div></section>
          <section className="class-chat"><div className="panel-heading"><div><h2>Chat de la classe</h2><p><span className="online-dot" /> Discussion en direct</p></div><MessageCircle size={17} /></div><div className="chat-feed">{chats.slice(-8).map((chat) => <div className={`chat-message ${chat.teacher ? "teacher-message" : ""}`} key={chat.id}><span className="chat-avatar">{chat.identity.slice(0, 2).toUpperCase()}</span><div><div><strong>{chat.identity}</strong><small>{chat.timestamp}</small></div><p>{chat.message}</p></div></div>)}</div><form className="chat-input" onSubmit={sendChat}><input value={chatInput} onChange={(event) => setChatInput(event.target.value)} placeholder="Écrire un message..." /><button type="submit" aria-label="Send message"><Send size={16} /></button></form></section>
        </aside>
      </div>
      <footer className="classroom-dock"><div className="session-widget"><span className="live-tag">LIVE</span><div><strong>Cours en cours</strong><span>Économie – Chapitre 3</span></div><b>00:45:23</b></div><div className="call-controls"><ControlBar controls={{ microphone: true, camera: true, screenShare: role === "teacher", chat: false }} /><RoomAudioRenderer /></div><div className="next-session"><span className="calendar-icon"><span>22</span></span><div><small>PROCHAIN COURS</small><strong>Comptabilité – Les états financiers</strong><span>Demain · 19:00</span></div><ChevronRight size={18} /></div></footer>
    </div>
  );
}

export default function ClassroomRoom({ room, identity, role }: ClassroomRoomProps) {
  const [token, setToken] = useState<string>();
  const [serverUrl, setServerUrl] = useState<string>();
  const [error, setError] = useState<string>();
  if (!token || !serverUrl) return <div className="classroom-entry-card"><div className="entry-emblem"><Video /></div><span className="eyebrow">PRIVATE LIVE CLASSROOM</span><h1>{role === "teacher" ? "Start your lecture" : "Enter the amphitheatre"}</h1><p>{role === "teacher" ? "Open the lecture hall and manage every student interaction." : "Join your assigned seat, watch the lesson, and participate in real time."}</p>{error && <p className="entry-error">{error}</p>}<button type="button" aria-label={role === "teacher" ? "Start class" : "Join class"} className="classroom-entry-button" onClick={async () => { setError(undefined); const response = await fetch("/api/livekit/token", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ room, identity, role }) }); const result = await response.json(); if (!response.ok) { setError(result.error || "Unable to join the room."); return; } setToken(result.token); setServerUrl(result.url); }}>{role === "teacher" ? "Start class" : "Join class"}<ChevronRight size={18} /></button></div>;
  return <LiveKitRoom token={token} serverUrl={serverUrl} connect video audio options={{ adaptiveStream: true, dynacast: true }}><ImmersiveRoom role={role} identity={identity} /></LiveKitRoom>;
}