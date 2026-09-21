"use client";

import Image from "next/image";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Check,
  Facebook,
  GraduationCap,
  Instagram,
  Linkedin,
  MessageCircle,
  Music2,
  ShieldCheck,
  Sparkles,
  Star,
  Trophy,
  Users,
  Video,
  type LucideIcon,
} from "lucide-react";
import { useState } from "react";
import Logo from "@/components/Logo";
import LeadRegistrationForm from "@/components/LeadRegistrationForm";
import profileImage from "@/unnamed.png";

type Language = "fr" | "en" | "ar";
type FeatureDefinition = [string, string, LucideIcon];

type LanguageCopy = {
  nav: string[];
  badge: string;
  title: string;
  subtitle: string;
  desc: string;
  primary: string;
  secondary: string;
  stats: [string, string][];
  aboutTitle: string;
  about: string[];
  strengths: string[];
  featuresTitle: string;
  features: FeatureDefinition[];
  subjectsTitle: string;
  subjects: string[];
  offersTitle: string;
  offerCards: [string, string, string, string][];
  footerTitle: string;
  socials: string[];
  contact: string;
  trigger: string;
  parentLabel: string;
  studentLabel: string;
  language: string;
};

const content: Record<Language, LanguageCopy> = {
  fr: {
    nav: ["Accueil", "Nos Matières", "Nos Formules", "À propos", "Témoignages"],
    badge: "Votre réussite, notre mission",
    title: "Allal Antaki",
    subtitle: "De la seconde à la réussite universitaire",
    desc:
      "Un accompagnement premium pour les élèves et étudiants qui veulent progresser avec rigueur, méthode et résultats visibles : cours live, coaching, suivi, préparation aux examens et à l’université.",
    primary: "Rejoindre la promotion",
    secondary: "Découvrir les formules",
    stats: [
      ["8+", "ans d’expérience"],
      ["500+", "étudiants accompagnés"],
      ["100%", "suivi personnalisé"],
      ["PFE", "conseil & préparation"],
    ],
    aboutTitle: "Un accompagnement académique pensé pour la réussite durable",
    about: [
      "Je suis Allal Antaki, enseignant en Économie, Management et Marketing, avec 8 années d’expérience dans des établissements privés et le réseau de la Mission française à Casablanca.",
      "Mon approche repose sur l’active pedagogy, la clarté d’explication et la discipline. J’aide les élèves à transformer les connaissances en autonomie, en méthode et en résultats mesurables.",
      "Que votre objectif soit l’examen de fin d’études, les cours universitaires, l’économie appliquée ou le PFE, chaque parcours est personnalisé pour votre niveau et votre ambition.",
    ],
    strengths: [
      "Expertise duale : programme national et Mission française",
      "Formation solide en économie / management / économétrie appliquée",
      "Accompagnement continu de la 2e à l’université",
      "Mentorat orienté résultats, confiance et méthodologie",
    ],
    featuresTitle: "Une académie de référence, pour chaque étape du parcours",
    features: [
      ["Cours live & coaching", "Séances structurées, conseils personnalisés et corrections ciblées.", Video],
      ["Quiz & suivi", "Évaluation continue, discipline et vigilance pour progresser sans tricherie.", ShieldCheck],
      ["Soutien parents", "Suivi simple, clair et orienté résultats grâce au reporting.", Users],
      ["Classement & bourses", "Motivation, excellence et récompenses pour les meilleurs profils.", Trophy],
    ],
    subjectsTitle: "Les matières qui façonnent votre avenir",
    subjects: ["Économie", "Comptabilité", "Management", "Marketing"],
    offersTitle: "Formules et coaching personnalisé",
    offerCards: [
      ["1 matière", "200 DH", "2 séances / semaine", "Idéal pour consolider une discipline."],
      ["Pack 3 matières", "500 DH", "6 séances / semaine", "Le plus demandé pour l’année complète."],
      ["Coaching privé", "250 DH / heure", "Rythme sur mesure", "Pour un accompagnement ciblé et intensif."],
    ],
    footerTitle: "Suivez la progression, rejoignez la communauté et contactez-nous",
    socials: ["Instagram", "TikTok", "Facebook", "LinkedIn"],
    contact: "Contact & inscriptions",
    trigger: "Je veux être accompagné",
    parentLabel: "Numéro du parent",
    studentLabel: "Numéro de l’étudiant",
    language: "Langue",
  },
  en: {
    nav: ["Home", "Programs", "Coaching", "About", "Register"],
    badge: "Your success, our mission",
    title: "Allal Antaki",
    subtitle: "From High School to University Success",
    desc:
      "I support students from high school to university with a rigorous, clear, and personalized learning method designed for measurable success.",
    primary: "Book a first session",
    secondary: "Explore offers",
    stats: [
      ["8+", "years of experience"],
      ["500+", "students mentored"],
      ["100%", "personalized support"],
      ["PFE", "guidance & prep"],
    ],
    aboutTitle: "Academic guidance built for lasting success",
    about: [
      "I am Allal Antaki, an educator in Economics, Management, and Marketing with 8 years of experience across private institutions and the French Mission network in Casablanca.",
      "My methodology is based on active pedagogy, clarity, and discipline. I help students turn abstract concepts into method, autonomy, and measurable performance.",
      "Whether your goal is the end-of-secondary exam, university coursework, applied economics, or the final degree project, each pathway is adapted to your ambition and level.",
    ],
    strengths: [
      "Dual expertise: national curriculum and French Mission system",
      "Strong academic foundation in economics, management, and applied econometrics",
      "Continuous support from secondary school to university",
      "Mentorship focused on results, confidence, and method",
    ],
    featuresTitle: "A high-standard academic platform at every step",
    features: [
      ["Live classes & coaching", "Structured sessions, targeted guidance, and regular corrections.", Video],
      ["Quizzes & follow-up", "Progress monitoring and accountability to keep learning consistent.", ShieldCheck],
      ["Parent support", "Clear progress reports and a transparent overview for families.", Users],
      ["Ranking & scholarships", "Motivation, excellence, and recognition for top performers.", Trophy],
    ],
    subjectsTitle: "Subjects that shape future opportunities",
    subjects: ["Economics", "Accounting", "Management", "Marketing"],
    offersTitle: "Personalized coaching and study formulas",
    offerCards: [
      ["1 subject", "200 DH", "2 sessions / week", "Perfect for improving one discipline."],
      ["3-subject pack", "500 DH", "6 sessions / week", "The most popular yearly plan."],
      ["Private coaching", "250 DH / hour", "Custom pace", "Ideal for intensive and targeted support."],
    ],
    footerTitle: "Follow progress, join the community, and contact us",
    socials: ["Instagram", "TikTok", "Facebook", "LinkedIn"],
    contact: "Contact & registration",
    trigger: "I want to be supported",
    parentLabel: "Parent phone number",
    studentLabel: "Student phone number",
    language: "Language",
  },
  ar: {
    nav: ["الرئيسية", "البرامج", "التدريب", "من نحن", "التسجيل"],
    badge: "نجاحك هو هدفنا",
    title: "علال أنطاكي",
    subtitle: "من الثانوية إلى النجاح الجامعي",
    desc:
      "أرافق التلاميذ والطلبة من الثانوية إلى الجامعة عبر منهجية واضحة، صارمة وفردية مصممة لتحقيق نتائج فعالة ومستدامة.",
    primary: "احجز جلسة أولية",
    secondary: "استكشف العروض",
    stats: [
      ["8+", "سنوات خبرة"],
      ["500+", "طالباً مرافَقاً"],
      ["100%", "متابعة شخصية"],
      ["PFE", "توجيه وتحضير"],
    ],
    aboutTitle: "مرافقة أكاديمية مبنية على النجاح الدائم",
    about: [
      "أنا علال أنطاكي، أستاذ في الاقتصاد والإدارة والتسويق، ولدي خبرة 8 سنوات في مؤسسات خاصة وشبكة Mission française في الدار البيضاء.",
      "تعتمد طريقتي على التعليم النشط، الوضوح والانضباط. أساعد الطلاب على ترجمة المعلومات إلى منهجية واستقلالية وأداء قابل للقياس.",
      "سواء كان هدفك النجاح في الثانوية، المقررات الجامعية، الاقتصاد التطبيقي أو مشروع التخرج، فإن كل مسار يتم تصميمه وفق مستواك وطموحك.",
    ],
    strengths: [
      "خبرة مزدوجة: المنهاج الوطني ونظام Mission française",
      "أساس أكاديمي قوي في الاقتصاد والإدارة والاقتصاد التطبيقي",
      "مرافقة مستمرة من الثانوية إلى الجامعة",
      "توجيه يركز على النتائج والثقة والمنهجية",
    ],
    featuresTitle: "منصة تعليمية عالية الجودة في كل مرحلة",
    features: [
      ["دروس مباشرة وت coaching", "جلسات منظمة، توجيهات دقيقة وتصحيحات مستهدفة.", Video],
      ["اختبارات ومتابعة", "تقييم مستمر ومساءلة للحفاظ على التقدم.", ShieldCheck],
      ["دعم أولياء الأمور", "تقارير واضحة وعرض شفاف للأسر.", Users],
      ["ترتيب ومنح", "حافز للتميز والاعتراف بالأداء الأفضل.", Trophy],
    ],
    subjectsTitle: "المواد التي تشكل مستقبلك",
    subjects: ["الاقتصاد", "المحاسبة", "الإدارة", "التسويق"],
    offersTitle: "عروض التدريب والتوجيه الشخصي",
    offerCards: [
      ["مادة واحدة", "200 درهم", "جلستان/أسبوع", "مثالي لتثبيت مادة واحدة."],
      ["باك 3 مواد", "500 درهم", "6 جلسات/أسبوع", "الخطة الأكثر طلباً."],
      ["تدريب خاص", "250 درهم/ساعة", "سرعة مخصصة", "للدعم المكثف والمستهدف."],
    ],
    footerTitle: "تابع التقدم، انضم إلى المجتمع، وتواصل معنا",
    socials: ["إنستغرام", "تيك توك", "فيسبوك", "لينكد إن"],
    contact: "التواصل والتسجيل",
    trigger: "أريد أن أُسند",
    parentLabel: "رقم ولي الأمر",
    studentLabel: "رقم الطالب",
    language: "اللغة",
  },
};

export default function AtelierLanding() {
  const [language, setLanguage] = useState<Language>("fr");
  const t = content[language];
  const isArabic = language === "ar";

  return (
    <main dir={isArabic ? "rtl" : "ltr"} className={`${isArabic ? "lang-ar" : ""} bg-[#f7f3ee] text-slate-900 antialiased`}>
      <section
        className="relative overflow-hidden bg-slate-950 text-white"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(7,16,16,0.9) 0%, rgba(7,16,16,0.74) 40%, rgba(7,16,16,0.82) 100%), url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1500&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="hero-grid absolute inset-0 opacity-20" />
        <div className="hero-orb red left-[-60px] top-20 h-64 w-64" />
        <div className="hero-orb green bottom-[-50px] right-[-30px] h-72 w-72" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(200,16,46,0.18),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(10,90,62,0.2),transparent_35%)]" />

        <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
          <Logo light />

          <div className="hidden items-center gap-7 text-sm text-white/75 md:flex">
            {t.nav.map((item) => (
              <a
                key={item}
                href={
                  item === "Accueil" || item === "Home" || item === "الرئيسية"
                    ? "#top"
                    : item === "Programmes" || item === "Programs" || item === "البرامج"
                      ? "#programmes"
                      : item === "Coaching" || item === "التدريب"
                        ? "#coaching"
                        : item === "À propos" || item === "About" || item === "من نحن"
                          ? "#apropos"
                          : "#inscription"
                }
                className="transition hover:text-white"
              >
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex rounded-full border border-white/15 bg-white/5 p-1 text-xs">
              {(["fr", "en", "ar"] as const).map((lang) => (
                <button
                  key={lang}
                  type="button"
                  onClick={() => setLanguage(lang)}
                  className={`rounded-full px-2.5 py-1.5 font-medium transition ${language === lang ? "bg-white text-slate-900" : "text-white/70 hover:text-white"}`}
                >
                  {lang.toUpperCase()}
                </button>
              ))}
            </div>
            <a href="#inscription" className="rounded-full border border-green-300/40 bg-[#0a5a3e]/70 px-4 py-2 text-sm font-medium text-white transition hover:bg-[#0a5a3e]">
              {t.contact}
            </a>
            <a href="/login" className="site-login-link rounded-full px-4 py-2 text-sm font-extrabold transition">
              Student / Teacher login
            </a>
          </div>
        </nav>

        <div id="top" className="relative mx-auto grid max-w-7xl gap-10 px-6 pb-20 pt-8 lg:grid-cols-[1.1fr_470px] lg:items-center">
          <div className="pb-4 soft-reveal">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-medium text-white/80 backdrop-blur-sm">
              <Star className="h-3.5 w-3.5 text-[#c8102e]" />
              {t.badge}
            </div>

            <h1 className="max-w-[640px] text-white">
              <span className="display-font block text-5xl font-black leading-[0.82] md:text-6xl xl:text-[5.5rem]">
                {t.title}
              </span>
              <span className="mt-3 block text-sm font-bold uppercase tracking-[0.26em] text-[#dfeae4] md:text-base">
                L’Atelier des Économistes
              </span>
              <span className="mt-5 block text-2xl font-semibold leading-tight text-white/90 md:text-3xl xl:text-[2.5rem]">
                {t.subtitle}
              </span>
            </h1>

            <p className="mt-6 max-w-[520px] text-lg leading-8 text-white/72">{t.desc}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a href="#inscription" className="group inline-flex items-center gap-2 rounded-xl bg-[#c8102e] px-6 py-3.5 font-bold text-white shadow-[0_18px_38px_rgba(200,16,46,0.4)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(200,16,46,0.5)]">
                {t.primary}
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
              <a href="#coaching" className="rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 font-bold text-white transition hover:bg-white/10 hover:border-white/30">
                {t.secondary}
              </a>
              <a href="/login" className="inline-flex items-center gap-2 rounded-xl border border-green-300/50 bg-[#0a5a3e] px-6 py-3.5 font-bold text-white shadow-[0_18px_38px_rgba(10,90,62,0.3)] transition hover:bg-[#006233]">
                Enter classroom
                <GraduationCap className="h-4 w-4" />
              </a>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ["Cours en direct", "Zoom"],
                ["Suivi individuel", "Coaching"],
                ["Quiz anti-triche", "Sécurisé"],
                ["Classement & bourses", "Motivation"],
              ].map(([title, subtitle]) => (
                <div
                  key={title}
                  className="min-w-[150px] flex-1 rounded-2xl border border-white/10 bg-white/5 p-3.5 backdrop-blur-sm transition duration-300 hover:border-[#d94c61]/60 hover:bg-white/10"
                >
                  <div className="text-[10px] uppercase tracking-[0.18em] text-white/55">{subtitle}</div>
                  <div className="mt-1 text-sm font-semibold text-white">{title}</div>
                </div>
              ))}
            </div>
          </div>

          <div id="inscription" className="soft-reveal relative z-10 w-full max-w-[430px] justify-self-end rounded-[28px] border border-white/10 bg-white/95 p-5 shadow-[0_25px_80px_rgba(0,0,0,0.28)] backdrop-blur">
            <div className="mb-4 flex items-center justify-between gap-3 rounded-2xl bg-[#f5f5f4] p-3 text-slate-800">
              <div className="flex items-center gap-2 text-sm font-bold">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#0a5a3e]/10 text-[#0a5a3e]">
                  <MessageCircle className="h-4 w-4" />
                </div>
                {t.contact}
              </div>
              <div className="rounded-full border border-[#0a5a3e]/20 bg-white px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#0a5a3e]">
                {t.trigger}
              </div>
            </div>

            <div className="mb-4 rounded-2xl border border-[#c8102e]/10 bg-[#fff6f8] p-3 text-xs text-[#5b1a24]">
              <div className="flex items-center justify-between gap-2">
                <span className="font-semibold uppercase tracking-[0.2em] text-[#c8102e]">Mentor</span>
                <span className="rounded-full bg-white px-2 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#0a5a3e]">Premium</span>
              </div>
            </div>

            <LeadRegistrationForm language={language} />
          </div>
        </div>
      </section>

      <section id="apropos" className="relative mx-auto max-w-7xl px-6 py-20">
        <div className="absolute inset-x-0 top-8 -z-10 mx-auto h-64 w-[80%] rounded-full bg-[#c8102e]/5 blur-3xl" />

        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-stretch">
          <div className="premium-card soft-reveal relative overflow-hidden rounded-[34px] border border-slate-200 bg-[#f5f0ea] p-4 shadow-[0_30px_90px_rgba(15,23,42,0.08)] sm:p-5">
            <div className="absolute left-5 top-5 rounded-full border border-white/80 bg-white/80 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] text-[#0a5a3e] shadow-sm">
              Mentor
            </div>
            <div className="overflow-hidden rounded-[28px] border border-white/60 bg-slate-200">
              <Image
                src={profileImage}
                alt="Allal Antaki"
                width={900}
                height={1100}
                className="h-[560px] w-full object-cover object-center grayscale-[0.08]"
                priority
              />
            </div>
          </div>

          <div className="premium-card soft-reveal rounded-[34px] border border-slate-200 bg-white p-7 shadow-[0_30px_90px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#c8102e]">{t.contact}</p>
                <h2 className="mt-3 display-font text-4xl font-black text-slate-900 md:text-5xl">{t.aboutTitle}</h2>
              </div>
              <div className="hidden h-12 w-12 items-center justify-center rounded-2xl bg-[#0a5a3e]/10 text-[#0a5a3e] sm:flex">
                <GraduationCap className="h-6 w-6" />
              </div>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {t.stats.map(([value, label]) => (
                <div key={value + label} className="rounded-2xl border border-slate-200 bg-gradient-to-br from-[#faf7f3] to-white p-4 text-center shadow-[0_16px_30px_rgba(15,23,42,0.03)]">
                  <div className="text-2xl font-black text-slate-900">{value}</div>
                  <div className="mt-1 text-xs leading-5 text-slate-600">{label}</div>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-4 text-lg leading-8 text-slate-600">
              {t.about.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-8 space-y-4">
              {t.strengths.map((strength) => (
                <div key={strength} className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-50 to-white p-4 transition duration-300 hover:border-[#0a5a3e]/30 hover:shadow-[0_14px_30px_rgba(10,90,62,0.07)]">
                  <div className="mt-0.5 flex h-7 w-7 items-center justify-center rounded-full bg-[#0a5a3e]/10 text-[#0a5a3e]">
                    <Check className="h-4 w-4" />
                  </div>
                  <p className="text-sm leading-6 text-slate-700">{strength}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="programmes" className="bg-slate-950 py-20 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#46d391]">{t.contact}</p>
            <h2 className="mt-3 display-font text-4xl font-black md:text-5xl">{t.featuresTitle}</h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
            {t.features.map(([title, desc, Icon]) => (
              <article key={title} className="premium-card soft-reveal rounded-[28px] border border-white/10 bg-gradient-to-br from-white/6 to-white/2 p-6 backdrop-blur-sm">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-[#c8102e] to-[#8d0d23] text-white shadow-[0_18px_30px_rgba(200,16,46,0.4)]">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-xl font-black">{title}</h3>
                <p className="mt-3 text-sm leading-6 text-white/65">{desc}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0a5a3e]">{t.contact}</p>
          <h2 className="mt-3 display-font text-4xl font-black text-slate-900 md:text-5xl">{t.subjectsTitle}</h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {t.subjects.map((subject, index) => (
            <div
              key={subject}
              className={`premium-card soft-reveal rounded-[28px] border p-6 ${index % 2 === 0 ? "border-[#0a5a3e]/15 bg-[#0a5a3e]/5" : "border-[#c8102e]/15 bg-[#c8102e]/5"}`}
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-950 text-white">
                {index === 0 ? <BookOpen className="h-5 w-5" /> : index === 1 ? <BarChart3 className="h-5 w-5" /> : index === 2 ? <Users className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
              </div>
              <h3 className="text-2xl font-black text-slate-900">{subject}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-600">
                {index === 0 && "Approfondissement des mécanismes économiques et des outils d’analyse."}
                {index === 1 && "Méthode comptable, analyse financière et rigueur dans les exercices."}
                {index === 2 && "Gestion, stratégie, organisation et prise de décision."}
                {index === 3 && "Marketing stratégique, études de marché et communication."}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section id="coaching" className="bg-[#f1efe9] py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-[#0a5a3e]">{t.contact}</p>
            <h2 className="mt-3 display-font text-4xl font-black text-slate-900 md:text-5xl">{t.offersTitle}</h2>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {t.offerCards.map(([name, price, cadence, description], index) => (
              <div
                key={name + price}
                className={`premium-card soft-reveal rounded-[30px] border p-7 shadow-sm ${index === 1 ? "border-[#0a5a3e] bg-gradient-to-br from-[#0a5a3e] to-[#073a2c] text-white shadow-[0_25px_80px_rgba(10,90,62,0.18)]" : "border-slate-200 bg-white text-slate-900"}`}
              >
                <div className={`text-lg font-black ${index === 1 ? "text-white" : "text-slate-900"}`}>{name}</div>
                <div className={`mt-4 text-4xl font-black ${index === 1 ? "text-white" : "text-slate-900"}`}>
                  {price}
                </div>
                <p className={`mt-4 font-semibold ${index === 1 ? "text-emerald-100" : "text-[#0a5a3e]"}`}>{cadence}</p>
                <p className={`mt-3 text-sm leading-6 ${index === 1 ? "text-emerald-50/90" : "text-slate-600"}`}>{description}</p>

                <ul className="mt-6 space-y-3 text-sm">
                  {["Cours live", "Support personnalisé", "Suivi pédagogique", "Correction ciblée"].map((item) => (
                    <li key={item} className="flex items-center gap-2">
                      <Check className={`h-4 w-4 ${index === 1 ? "text-white" : "text-[#0a5a3e]"}`} />
                      {item}
                    </li>
                  ))}
                </ul>

                <a href="#inscription" className={`mt-7 block rounded-xl px-5 py-3 text-center font-bold transition ${index === 1 ? "bg-white text-[#0a5a3e]" : "bg-[#c8102e] text-white"}`}>
                  {t.primary}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-slate-950 px-6 py-12 text-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div>
            <Logo light />
            <p className="mt-4 max-w-xl text-sm leading-6 text-white/55">{t.footerTitle}</p>
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              { label: "Instagram", href: "https://instagram.com/atelierdeseconomistes", icon: Instagram },
              { label: "TikTok", href: "https://www.tiktok.com/@atelierdeseconomistes", icon: Music2 },
              { label: "Facebook", href: "https://facebook.com/atelierdeseconomistes", icon: Facebook },
              { label: "LinkedIn", href: "https://www.linkedin.com/company/atelier-des-economistes", icon: Linkedin },
            ].map(({ label, href, icon: Icon }) => (
              <a key={label} href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75 transition hover:border-white/20 hover:text-white">
                <Icon className="h-4 w-4" />
                {label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
