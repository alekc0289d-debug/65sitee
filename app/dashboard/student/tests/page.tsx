"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Loader2, Check, X, ArrowRight, RotateCw, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Progress } from "@/components/ui/Progress";
import { useAuth } from "@/hooks/useAuth";
import { api } from "@/lib/api/client";

interface TestItem {
  testId: string; subject: string; difficulty: string;
  reward: number; questionCount: number;
  questions: { q: string; options: string[] }[];
}

interface Attempt { id: string; testId: string; subject: string; score: number; total: number; percent: number; passed: boolean; }

type Phase = "list" | "quiz" | "result";

export default function StudentTestsPage() {
  const { user, loading: authLoading } = useAuth(true);
  const [tests, setTests] = useState<TestItem[]>([]);
  const [attempts, setAttempts] = useState<Attempt[]>([]);
  const [loading, setLoading] = useState(true);

  const [phase, setPhase] = useState<Phase>("list");
  const [activeTest, setActiveTest] = useState<TestItem | null>(null);
  const [answers, setAnswers] = useState<number[]>([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function load() {
    if (!user?.id) return;
    setLoading(true);
    try {
      const cls = user.classId || "9-A";
      const [t, a] = await Promise.all([
        api.get<TestItem[]>(`/api/tests/class/${cls}`),
        api.get<Attempt[]>(`/api/tests/user/${user.id}/attempts?limit=10`),
      ]);
      setTests(Array.isArray(t) ? t : []);
      setAttempts(Array.isArray(a) ? a : []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [user?.id]);

  function startTest(t: TestItem) {
    setActiveTest(t);
    setAnswers(new Array(t.questions.length).fill(-1));
    setCurrentQ(0);
    setPhase("quiz");
  }

  async function submitTest() {
    if (!user?.id || !activeTest) return;
    if (answers.some((a) => a === -1)) {
      alert("Barcha savollarga javob bering!");
      return;
    }
    setBusy(true);
    try {
      const res = await api.post<any>("/api/tests/submit", {
        userId: user.id, testId: activeTest.testId, answers,
      });
      setResult(res);
      setPhase("result");
    } finally {
      setBusy(false);
    }
  }

  if (authLoading || loading) return (
    <div className="flex items-center justify-center h-96">
      <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
    </div>
  );

  // ============== LIST ==============
  if (phase === "list") {
    return (
      <div className="space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-3xl font-bold text-amber-950 flex items-center gap-3">
            <Award className="w-8 h-8 text-amber-500" />
            Testlar
          </h1>
          <p className="text-stone-500 mt-1">{tests.length} ta test mavjud</p>
        </motion.div>

        {/* Attempts */}
        {attempts.length > 0 && (
          <Card>
            <h3 className="text-lg font-bold text-amber-950 mb-4">Oxirgi urinishlar</h3>
            <div className="space-y-2">
              {attempts.slice(0, 5).map((a) => (
                <div key={a.id} className="flex items-center justify-between p-3 rounded-2xl bg-stone-50">
                  <div>
                    <p className="font-semibold text-sm text-amber-950">{a.subject}</p>
                    <p className="text-xs text-stone-500">{a.score}/{a.total} to&apos;g&apos;ri</p>
                  </div>
                  <Badge variant={a.passed ? "success" : "danger"}>{a.percent}%</Badge>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Tests */}
        <div className="grid md:grid-cols-2 gap-4">
          {tests.map((t, i) => (
            <motion.div key={t.testId} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card hover>
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white">
                    <Award className="w-6 h-6" />
                  </div>
                  <Badge variant={
                    t.difficulty === "hard" ? "danger" :
                    t.difficulty === "medium" ? "warning" : "success"
                  }>
                    {t.difficulty === "hard" ? "Qiyin" : t.difficulty === "medium" ? "O'rta" : "Oson"}
                  </Badge>
                </div>
                <h3 className="font-bold text-amber-950 mb-1">{t.subject}</h3>
                <p className="text-sm text-stone-500 mb-4">
                  {t.questionCount} ta savol · +{t.reward} ball
                </p>
                <Button onClick={() => startTest(t)} className="w-full">
                  Boshlash
                </Button>
              </Card>
            </motion.div>
          ))}
        </div>

        {tests.length === 0 && (
          <Card>
            <div className="text-center py-16">
              <Award className="w-16 h-16 text-amber-300 mx-auto mb-4" />
              <p className="text-stone-500">Hozircha testlar yo&apos;q</p>
            </div>
          </Card>
        )}
      </div>
    );
  }

  // ============== QUIZ ==============
  if (phase === "quiz" && activeTest) {
    const q = activeTest.questions[currentQ];
    const progress = ((currentQ + 1) / activeTest.questions.length) * 100;

    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <Badge variant="amber">{activeTest.subject}</Badge>
            <span className="text-sm text-stone-500">
              {currentQ + 1} / {activeTest.questions.length}
            </span>
          </div>
          <Progress value={progress} color="amber" />

          <AnimatePresence mode="wait">
            <motion.div
              key={currentQ}
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 }}
              className="mt-6"
            >
              <h2 className="text-xl font-bold text-amber-950 mb-6">{q.q}</h2>
              <div className="space-y-3">
                {q.options.map((opt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      const a = [...answers];
                      a[currentQ] = i;
                      setAnswers(a);
                    }}
                    className={`w-full text-left p-4 rounded-2xl border-2 transition-all ${
                      answers[currentQ] === i
                        ? "bg-amber-50 border-amber-400"
                        : "bg-white border-stone-200 hover:border-amber-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-sm ${
                        answers[currentQ] === i ? "bg-amber-500 text-white" : "bg-stone-100 text-stone-500"
                      }`}>
                        {String.fromCharCode(65 + i)}
                      </div>
                      <span className="font-medium text-stone-800">{opt}</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>

          <div className="flex gap-2 mt-6">
            {currentQ > 0 && (
              <Button variant="secondary" onClick={() => setCurrentQ(currentQ - 1)} className="flex-1">
                Orqaga
              </Button>
            )}
            {currentQ < activeTest.questions.length - 1 ? (
              <Button
                onClick={() => setCurrentQ(currentQ + 1)}
                disabled={answers[currentQ] === -1}
                className="flex-1"
              >
                Keyingi <ArrowRight className="w-4 h-4" />
              </Button>
            ) : (
              <Button onClick={submitTest} disabled={busy || answers.some((a) => a === -1)} className="flex-1">
                {busy ? <><Loader2 className="w-4 h-4 animate-spin" /> Yuborilmoqda...</> : "Yakunlash"}
              </Button>
            )}
          </div>
        </Card>
      </div>
    );
  }

  // ============== RESULT ==============
  if (phase === "result" && result) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <Card className={result.passed ? "!border-green-300" : "!border-red-300"}>
            <div className="text-center py-8">
              <div className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-6 ${
                result.passed ? "bg-gradient-to-br from-green-400 to-green-600" : "bg-red-100"
              }`}>
                {result.passed ? <Check className="w-10 h-10 text-white" /> : <X className="w-10 h-10 text-red-500" />}
              </div>
              <h2 className="text-3xl font-bold text-amber-950 mb-2">
                {result.passed ? "Tabriklaymiz! 🎉" : "Yaxshiroq urinib ko'ring"}
              </h2>
              <p className="text-lg text-stone-600 mb-6">
                {result.score} / {result.total} to&apos;g&apos;ri ({result.percent}%)
              </p>
              {result.passed && result.reward > 0 && (
                <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-amber-100 border border-amber-200">
                  <Sparkles className="w-5 h-5 text-amber-600" />
                  <span className="font-bold text-amber-800">+{result.reward} ball</span>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Detailed */}
        {result.detailed && result.detailed.length > 0 && (
          <Card>
            <h3 className="font-bold text-amber-950 mb-4">Tahlil</h3>
            <div className="space-y-3">
              {result.detailed.map((d: any, i: number) => (
                <div key={i} className={`p-3 rounded-2xl border-2 ${
                  d.is_correct ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                }`}>
                  <p className="text-sm font-semibold text-stone-800 mb-1">{d.question}</p>
                  <p className="text-xs text-stone-600">
                    Sizning javob: <b>{d.your_answer}</b>
                  </p>
                  {!d.is_correct && (
                    <p className="text-xs text-green-700 mt-1">
                      To&apos;g&apos;ri: <b>{d.correct_answer}</b>
                    </p>
                  )}
                </div>
              ))}
            </div>
          </Card>
        )}

        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => { setPhase("list"); load(); }} className="flex-1">
            <RotateCw className="w-4 h-4" /> Testlar ro&apos;yxati
          </Button>
        </div>
      </div>
    );
  }

  return null;
}