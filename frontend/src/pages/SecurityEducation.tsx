import React, { useState } from 'react';
import { 
  GraduationCap, 
  HelpCircle, 
  CheckCircle2, 
  XCircle, 
  Award, 
  RotateCcw, 
  AlertTriangle, 
  Eye, 
  Sparkles,
  ShieldCheck,
  BookOpen
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { soundFX } from '../services/sound';

interface Question {
  question: string;
  scenario: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

const QUIZ_QUESTIONS: Question[] = [
  {
    question: "You receive an SMS: 'Your electricity will be disconnected tonight at 9:30 PM due to unpaid bill. Call officer at 9876543210'. What should you do?",
    scenario: "SMS sender identifier is 'VM-POWDIS'.",
    options: [
      "Immediately call the mobile number to clarify and pay via UPI",
      "Ignore the message or verify your bill on the official state DISCOM portal / app",
      "Download the 'electricity update APK' sent by the caller",
      "Forward the message to your neighbors so they can pay on your behalf"
    ],
    correctIndex: 1,
    explanation: "State electricity distribution boards never route bill payments to personal 10-digit mobile numbers or demand instant APK installations under threat of imminent power cutoff."
  },
  {
    question: "A municipal parking meter has a QR code sticker saying 'Pay Parking Fast Online'. What is the safest action?",
    scenario: "The sticker looks slightly raised as if pasted over the physical metal panel.",
    options: [
      "Scan the QR code and immediately enter your credit card on whatever webpage opens",
      "Do not scan physical stickers; use the official municipal parking app or pay at the physical credit card terminal",
      "Scan the code, but only if your phone shows HTTPS padlock",
      "Take a photo of your credit card and tweet it to the parking company"
    ],
    correctIndex: 1,
    explanation: "Criminals frequently paste fraudulent QR stickers over legitimate meters ('Quishing'). HTTPS alone does NOT guarantee legitimacy, as phishing sites also use free SSL certificates."
  },
  {
    question: "Which of the following domains is the legitimate official State Bank of India portal?",
    scenario: "You are looking to access online netbanking securely.",
    options: [
      "https://sbi-online-yono-update.com",
      "https://onlinesbi.sbi or https://sbi.co.in",
      "https://statebankofindia-kyc.org",
      "https://sbi.netbanking-portal.vip"
    ],
    correctIndex: 1,
    explanation: "State Bank of India owns the exclusive brand TLD '.sbi' and domain 'sbi.co.in'. Any domain with hyphens like 'sbi-online-yono-update.com' on .com/.org/.vip is a phishing trap."
  },
  {
    question: "A caller claiming to be from your bank asks you to download 'AnyDesk' or 'TeamViewer' to fix an OTP issue. Why is this dangerous?",
    scenario: "They promise it will only take 2 minutes and will unblock your account.",
    options: [
      "It will use up all your monthly cellular data allowance",
      "These are Remote Access tools that grant the caller full view and control over your phone screen to steal OTPs and bank credentials",
      "The app will secretly call international numbers",
      "It will permanently delete your phone gallery"
    ],
    correctIndex: 1,
    explanation: "AnyDesk, TeamViewer, and QuickSupport allow scammers to observe your screen in real time, bypassing 2FA by intercepting one-time passwords as you type them."
  }
];

export const SecurityEducation: React.FC = () => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);

  const activeQuestion = QUIZ_QUESTIONS[currentQ];

  const handleSelectOption = (index: number) => {
    if (isAnswered) return;
    soundFX.playClick();
    setSelectedAnswer(index);
    setIsAnswered(true);

    if (index === activeQuestion.correctIndex) {
      soundFX.playSafeSuccess();
      setScore((prev) => prev + 1);
    } else {
      soundFX.playThreatAlert();
    }
  };

  const handleNext = () => {
    soundFX.playClick();
    if (currentQ + 1 < QUIZ_QUESTIONS.length) {
      setCurrentQ((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      setQuizFinished(true);
      if (score + (selectedAnswer === activeQuestion.correctIndex ? 1 : 0) >= 3) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    }
  };

  const handleResetQuiz = () => {
    soundFX.playClick();
    setCurrentQ(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setScore(0);
    setQuizFinished(false);
  };

  return (
    <div className="space-y-6 pb-12 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20 bg-gradient-to-r from-slate-900 via-[#121c33] to-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <GraduationCap className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold font-mono tracking-tight text-white flex items-center gap-2">
              CYBER DEFENSE ACADEMY & SIMULATOR
            </h1>
            <p className="text-xs text-slate-400 font-sans">
              Test your threat-spotting instincts against simulated phishing, smishing, and social engineering scenarios.
            </p>
          </div>
        </div>

        <div className="p-2 rounded-xl bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 font-mono text-xs flex items-center gap-2">
          <Award className="w-4 h-4 text-cyan-400" />
          <span>PHISHING IQ RATING</span>
        </div>
      </div>

      {/* Simulator Notice Box */}
      <div className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800 text-[11px] font-mono text-slate-400 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
        <span>
          <strong>EDUCATIONAL NOTICE:</strong> Scenarios in this academy are controlled simulations designed for awareness training. They are clearly distinguished from live telemetry scans.
        </span>
      </div>

      {/* Interactive Phishing IQ Quiz */}
      <div className="glass-panel p-6 md:p-8 rounded-2xl border border-slate-800 space-y-6">
        {!quizFinished ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 font-mono text-xs">
              <span className="text-cyan-400 font-bold uppercase">
                SCENARIO {currentQ + 1} OF {QUIZ_QUESTIONS.length}
              </span>
              <span className="text-slate-400">Current Score: <strong className="text-white">{score}</strong></span>
            </div>

            {/* Question Details */}
            <div className="space-y-2">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-850 text-xs font-mono text-amber-300">
                {activeQuestion.scenario}
              </div>
              <h2 className="text-base sm:text-lg font-bold font-sans text-white leading-relaxed">
                {activeQuestion.question}
              </h2>
            </div>

            {/* Options */}
            <div className="space-y-3 font-sans text-xs">
              {activeQuestion.options.map((opt, idx) => {
                let btnStyle = 'bg-slate-900/80 hover:bg-slate-800 border-slate-800 text-slate-200';
                if (isAnswered) {
                  if (idx === activeQuestion.correctIndex) {
                    btnStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-300 cyber-glow-green';
                  } else if (idx === selectedAnswer) {
                    btnStyle = 'bg-red-950/80 border-red-500 text-red-300 cyber-glow-red';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    className={`w-full text-left p-4 rounded-xl border transition flex items-center justify-between gap-3 ${btnStyle}`}
                  >
                    <span className="font-medium">{opt}</span>
                    {isAnswered && idx === activeQuestion.correctIndex && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    )}
                    {isAnswered && idx === selectedAnswer && idx !== activeQuestion.correctIndex && (
                      <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation card */}
            {isAnswered && (
              <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs font-sans text-slate-300 space-y-2 animate-fadeIn">
                <span className="text-[10px] uppercase font-mono font-bold text-cyan-400 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" /> Cyber Analyst Explanation:
                </span>
                <p className="leading-relaxed">{activeQuestion.explanation}</p>

                <div className="pt-2 flex justify-end">
                  <button
                    onClick={handleNext}
                    className="px-5 py-2 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold font-mono text-xs uppercase tracking-wider transition shadow-lg shadow-cyan-400/20"
                  >
                    {currentQ + 1 < QUIZ_QUESTIONS.length ? 'Next Scenario →' : 'View Results'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Quiz Results Celebration */
          <div className="text-center py-8 space-y-4 font-mono">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400 mx-auto cyber-glow-cyan">
              <Award className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold text-white">
              SIMULATION COMPLETED!
            </h2>
            <p className="text-sm text-slate-400">
              You scored <strong className="text-cyan-400 text-xl">{score}</strong> out of <strong className="text-white">{QUIZ_QUESTIONS.length}</strong>
            </p>

            <div className="max-w-md mx-auto p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300">
              {score >= 3 ? (
                <span className="text-emerald-400 font-bold">
                  🛡️ ADVANCED DEFENDER: You possess sharp threat detection instincts and cannot be easily deceived by smishing lures.
                </span>
              ) : (
                <span className="text-amber-400 font-bold">
                  ⚠️ VULNERABLE TO SOCIAL ENGINEERING: Review our security cheat sheet below to strengthen your defenses against psychological manipulation.
                </span>
              )}
            </div>

            <button
              onClick={handleResetQuiz}
              className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold text-xs transition border border-slate-700 inline-flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Retry Simulation Quiz</span>
            </button>
          </div>
        )}
      </div>

      {/* Cyber Defense Cheat Sheet */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <h3 className="text-sm font-mono font-bold text-cyan-400 uppercase">
            Rule #1: Inspect Domain Hierarchy (Right-to-Left)
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Look at the label immediately preceding the TLD. In <code className="text-cyan-300">sbi.bank.login-portal.vip</code>, the true owner is <strong className="text-red-400">login-portal.vip</strong>, NOT SBI. Scammers use excessive subdomains to deceive mobile screens.
          </p>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-slate-800 space-y-2">
          <h3 className="text-sm font-mono font-bold text-amber-400 uppercase">
            Rule #2: Recognize the 3 Psychological Triggers
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            Every scam operates through: <strong>1) False Urgency</strong> (cutoff in 12 hours), <strong>2) Fear of Authority</strong> (police arrest, tax penalty), or <strong>3) Greed</strong> (lottery, free gifts). Pause before clicking!
          </p>
        </div>
      </div>
    </div>
  );
};

