"use client";

import { useState } from "react";

type Language = "fr" | "en" | "ar";

const translations = {
  fr: {
    title: "Inscription rapide",
    subtitle: "Rejoignez votre prochaine promotion.",
    student: "Je suis",
    studentOptions: ["Élève / Étudiant", "Parent"],
    fullName: "Nom complet",
    studentPhone: "Numéro de l’étudiant",
    parentPhone: "Numéro du parent",
    level: "Niveau scolaire",
    levelOptions: ["2ème Bac Économie", "BTS / EST", "Prépa", "ENCG", "Autre"],
    subjects: "Matières souhaitées",
    package: "Formule",
    packageOptions: [
      "1 Matière — 200 DH/mois",
      "2 Matières — 400 DH/mois",
      "Pack 3 Matières — 500 DH/mois",
      "Coaching Privé — 250 DH / heure",
    ],
    payment: "Mode de paiement",
    paymentOptions: ["Virement bancaire", "Cash Plus / Espèces en agence"],
    submit: "S’inscrire maintenant →",
    sending: "Envoi...",
    successTitle: "Inscription reçue",
    successText: "Votre message a été envoyé sur WhatsApp et notre équipe va vous répondre rapidement.",
  },
  en: {
    title: "Quick registration",
    subtitle: "Join the next cohort.",
    student: "I am",
    studentOptions: ["Student", "Parent"],
    fullName: "Full name",
    studentPhone: "Student phone number",
    parentPhone: "Parent phone number",
    level: "Academic level",
    levelOptions: ["High school economics", "BTS / EST", "Preparatory class", "ENCG", "Other"],
    subjects: "Desired subjects",
    package: "Package",
    packageOptions: [
      "1 Subject — 200 DH/month",
      "2 Subjects — 400 DH/month",
      "3-Subject Pack — 500 DH/month",
      "Private Coaching — 250 DH / hour",
    ],
    payment: "Payment method",
    paymentOptions: ["Bank transfer", "Cash Plus / cash at office"],
    submit: "Register now →",
    sending: "Sending...",
    successTitle: "Registration received",
    successText: "Your WhatsApp message was sent successfully and our team will contact you shortly.",
  },
  ar: {
    title: "تسجيل سريع",
    subtitle: "انضم إلى الدفعة القادمة.",
    student: "أنا",
    studentOptions: ["طالب / طالبة", "ولي أمر"],
    fullName: "الاسم الكامل",
    studentPhone: "رقم الطالب",
    parentPhone: "رقم ولي الأمر",
    level: "المستوى الدراسي",
    levelOptions: ["الثانوية الاقتصادية", "ب ت س / اس تي", "التحضيري", "الإنغ", "أخرى"],
    subjects: "المواد المطلوبة",
    package: "الباقة",
    packageOptions: [
      "مادة واحدة — 200 درهم/شهر",
      "مادتان — 400 درهم/شهر",
      "باك 3 مواد — 500 درهم/شهر",
      "تدريب خاص — 250 درهم/ساعة",
    ],
    payment: "طريقة الدفع",
    paymentOptions: ["تحويل بنكي", "كاش بلس / نقدا في المكتب"],
    submit: "سجل الآن →",
    sending: "جارٍ الإرسال...",
    successTitle: "تم استلام التسجيل",
    successText: "تم إرسال رسالتك عبر واتساب وسيقوم فريقنا بالتواصل معك قريباً.",
  },
};

export default function LeadRegistrationForm({ language = "fr" }: { language?: Language }) {
  const copy = translations[language];
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const selectedSubjects = form.getAll("subjects").map(String);
    const studentPhone = String(form.get("student_whatsapp") || form.get("whatsapp") || "").trim();
    const parentPhone = String(form.get("parent_whatsapp") || "").trim();
    const payload = {
      role: form.get("role") || "student",
      full_name: String(form.get("full_name") || "").trim(),
      whatsapp: studentPhone,
      student_whatsapp: studentPhone,
      parent_whatsapp: parentPhone,
      level: String(form.get("level") || "").trim(),
      package: String(form.get("package") || "").trim(),
      payment_method: String(form.get("payment_method") || "").trim(),
      subjects: selectedSubjects,
    };

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        throw new Error(data.error || "Something went wrong");
      }

      const message =
        `Bonjour Allal, je souhaite m'inscrire.%0A` +
        `Nom: ${payload.full_name}%0A` +
        `Rôle: ${payload.role}%0A` +
        `Étudiant: ${payload.whatsapp}%0A` +
        `Parent: ${payload.parent_whatsapp || "N/A"}%0A` +
        `Niveau: ${payload.level}%0A` +
        `Matières: ${selectedSubjects.join(", ") || "N/A"}%0A` +
        `Formule: ${payload.package}%0A` +
        `Paiement: ${payload.payment_method}`;

      window.open(`https://wa.me/212695031414?text=${message}`, "_blank", "noopener,noreferrer");
      setDone(true);
    } catch (error) {
      alert(error instanceof Error ? error.message : "Erreur d’envoi");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="rounded-3xl border border-green-200 bg-green-50 p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#006233] text-white">✓</div>
        <h3 className="text-xl font-black text-slate-900">{copy.successTitle}</h3>
        <p className="mt-2 text-sm text-slate-600">{copy.successText}</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold">
          {copy.student}
          <select name="role" required className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none ring-0 transition focus:border-[#006233]">
            {copy.studentOptions.map((option) => (
              <option key={option} value={option === "Parent" || option === "ولي أمر" ? "parent" : "student"}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="text-sm font-semibold">
          {copy.fullName}
          <input name="full_name" required className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none transition focus:border-[#006233]" placeholder="Ex. Mohamed El Amrani" />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="text-sm font-semibold">
          {copy.studentPhone}
          <input name="student_whatsapp" required className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none transition focus:border-[#006233]" placeholder="+212 6 XX XX XX XX" />
        </label>

        <label className="text-sm font-semibold">
          {copy.parentPhone}
          <input name="parent_whatsapp" required className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none transition focus:border-[#006233]" placeholder="+212 6 XX XX XX XX" />
        </label>
      </div>

      <label className="text-sm font-semibold">
        {copy.level}
        <select name="level" required className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none transition focus:border-[#006233]">
          <option value="">{copy.level}</option>
          {copy.levelOptions.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>
      </label>

      <fieldset>
        <legend className="text-sm font-semibold">{copy.subjects}</legend>
        <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {["Économie", "Comptabilité", "Management", "Marketing"].map((subject) => (
            <label key={subject} className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700">
              <input type="checkbox" name="subjects" value={subject} />
              {subject}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="text-sm font-semibold">
        {copy.package}
        <select name="package" required className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none transition focus:border-[#006233]">
          {copy.packageOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </label>

      <label className="text-sm font-semibold">
        {copy.payment}
        <select name="payment_method" required className="mt-1 w-full rounded-xl border border-slate-200 bg-white p-3 text-slate-900 outline-none transition focus:border-[#006233]">
          {copy.paymentOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </label>

      <button disabled={loading} className="w-full rounded-xl bg-[#c8102e] px-5 py-4 font-bold text-white transition hover:bg-[#a80d24] disabled:opacity-60">
        {loading ? copy.sending : copy.submit}
      </button>

      <p className="text-center text-xs text-slate-500">🔒 Vos informations sont utilisées uniquement pour votre admission et votre accompagnement.</p>
    </form>
  );
}
