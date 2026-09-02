import { RotateCcw } from "lucide-react";
import confetti from "canvas-confetti";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import DimensionRadar from "../components/DimensionRadar";
import PersonaCard from "../components/PersonaCard";
import ShareSummary from "../components/ShareSummary";
import { dimensions, personaById } from "../lib/personas";
import { sessionStore } from "../lib/session";
import type { AssessmentResult } from "../lib/types";

export default function Results() {
  const [, navigate] = useLocation();
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [ready, setReady] = useState(false);
  const [shareMessage, setShareMessage] = useState("");

  useEffect(() => {
    const stored = sessionStore.getResult();
    setResult(stored);
    setReady(true);
  }, []);

  useEffect(() => {
    if (!result) return;
    const timers = [
      window.setTimeout(() => {
        confetti({
          particleCount: 90,
          spread: 78,
          startVelocity: 42,
          origin: { y: 0.72 },
          colors: ["#0f766e", "#b45309", "#22303a", "#14b8a6"],
        });
      }, 220),
      window.setTimeout(() => {
        confetti({
          particleCount: 48,
          angle: 60,
          spread: 64,
          origin: { x: 0, y: 0.72 },
          colors: ["#0f766e", "#b45309"],
        });
      }, 460),
      window.setTimeout(() => {
        confetti({
          particleCount: 48,
          angle: 120,
          spread: 64,
          origin: { x: 1, y: 0.72 },
          colors: ["#14b8a6", "#22303a"],
        });
      }, 600),
    ];

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [result]);

  useEffect(() => {
    if (!shareMessage) return;
    const timer = window.setTimeout(() => setShareMessage(""), 2200);
    return () => window.clearTimeout(timer);
  }, [shareMessage]);

  if (!ready) {
    return <main className="page-shell"><div className="panel">正在读取结果…</div></main>;
  }

  if (!result) {
    return (
      <main className="page-shell">
        <section className="panel">
          <h1>没有找到测试结果</h1>
          <p>可能是在新的浏览器窗口打开了结果页，或本机记录已被清除。</p>
          <button className="button primary" type="button" onClick={() => navigate("/")}>
            重新测试
          </button>
        </section>
      </main>
    );
  }

  const primary = personaById.get(result.primaryPersonaId);
  const secondary = personaById.get(result.secondaryPersonaId);
  if (!primary || !secondary) {
    return (
      <main className="page-shell">
        <section className="panel">
          <h1>结果数据版本不匹配</h1>
          <button className="button primary" type="button" onClick={() => navigate("/")}>
            返回首页
          </button>
        </section>
      </main>
    );
  }

  const partners = primary.recommendedPartnerIds
    .map((id) => personaById.get(id))
    .filter(Boolean);

  return (
    <main className="page-shell">
      <header className="result-header">
        <div>
          <p className="eyebrow">测试完成</p>
          <h1>{result.nickname} 的公司人格卡</h1>
        </div>
        <div className="result-actions">
          <button className="button primary" type="button" onClick={() => navigate("/")}>
            <RotateCcw aria-hidden="true" />
            再测一次
          </button>
        </div>
      </header>

      <PersonaCard
        persona={primary}
        secondaryPersona={secondary}
        matchScore={result.matchScores[primary.id]}
        nickname={result.nickname}
      />

      <ShareSummary
        result={result}
        primary={primary}
        secondary={secondary}
        onMessage={setShareMessage}
      />

      <div className="result-grid">
        <section className="panel">
          <h2>十维行为剖面</h2>
          <DimensionRadar scores={result.dimensionScores} />
          <div className="dimension-list">
            {dimensions.map((dimension) => (
              <div className="dimension-row" key={dimension.id}>
                <div className="dimension-labels">
                  <span>{dimension.leftPole}</span>
                  <strong>{dimension.shortName}</strong>
                  <span>{dimension.rightPole}</span>
                </div>
                <div className="dimension-track">
                  <span style={{ width: `${result.dimensionScores[dimension.id]}%` }} />
                </div>
                <b>{result.dimensionScores[dimension.id]}</b>
              </div>
            ))}
          </div>
        </section>

        <section className="panel">
          <h2>优势与盲区</h2>
          <div className="list-block">
            <h3>优势</h3>
            <ul>
              {primary.strengths.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="list-block">
            <h3>潜在盲区</h3>
            <ul>
              {primary.blindSpots.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>

        <section className="panel">
          <h2>协作建议</h2>
          <p>{primary.collaborationStyle}</p>
          <h3>推荐搭档</h3>
          <div className="partner-list">
            {partners.map((partner) => (
              <span key={partner!.id}>
                {partner!.name}｜{partner!.nickname}
              </span>
            ))}
          </div>
          <p className="disclaimer">
            本结果描述工作行为倾向，不构成心理诊断、能力评价、绩效评价或招聘建议。
          </p>
        </section>
      </div>

      <footer className="ai-generation-note">
        本测试内容由 AI 根据燧原公司文化价值观生成，用于团队交流与自我觉察，不作为评价、决策或任何正式参考。
      </footer>

      {shareMessage && <div className="share-toast">{shareMessage}</div>}
    </main>
  );
}
