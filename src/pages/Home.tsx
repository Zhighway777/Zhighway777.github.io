import { Play, ShieldCheck, Timer } from "lucide-react";
import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { sessionStore } from "../lib/session";

const facts = [
  { icon: Timer, title: "25 道情境题", text: "预计 6～10 分钟完成" },
  { icon: ShieldCheck, title: "仅本机保存", text: "初版不上传答案和结果" },
  { icon: Play, title: "全部门可答", text: "不要求技术或项目管理背景" },
];

export default function Home() {
  const [, navigate] = useLocation();
  const [nickname, setNickname] = useState("");

  useEffect(() => {
    setNickname(sessionStore.getNickname());
  }, []);

  const start = () => {
    sessionStore.setNickname(nickname);
    navigate("/test");
  };

  return (
    <main className="page-shell">
      <section className="start-panel">
        <div className="start-copy">
          <p className="eyebrow">Company Persona v0.1</p>
          <h1>公司人格图鉴</h1>
          <p className="lead">
            通过真实工作情境，识别你在需求、交付、系统思考、协作治理和
            AI 委托上的行为倾向。
          </p>

          <label className="input-label" htmlFor="nickname">
            昵称（可选）
          </label>
          <input
            id="nickname"
            className="text-input"
            value={nickname}
            maxLength={24}
            onChange={(event) => setNickname(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") start();
            }}
            placeholder="例如：小周"
          />

          <div className="start-actions">
            <button className="button primary" type="button" onClick={start}>
              开始测试
            </button>
            <button
              className="button ghost"
              type="button"
              onClick={() => {
                sessionStore.clearAll();
                setNickname("");
              }}
            >
             清除本机记录
            </button>
          </div>
        </div>

        <aside className="fact-column" aria-label="测试说明">
          {facts.map((fact) => (
            <div className="fact-item" key={fact.title}>
              <fact.icon aria-hidden="true" />
              <div>
                <strong>{fact.title}</strong>
                <span>{fact.text}</span>
              </div>
            </div>
          ))}
        </aside>
      </section>
    </main>
  );
}
