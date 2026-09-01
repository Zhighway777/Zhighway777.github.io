import { Check, Copy, Link2, Share2 } from "lucide-react";
import { useMemo, useState } from "react";
import { dimensions } from "../lib/personas";
import type { AssessmentResult, Persona } from "../lib/types";

interface ShareSummaryProps {
  result: AssessmentResult;
  primary: Persona;
  secondary: Persona;
  onMessage: (message: string) => void;
}

export default function ShareSummary({
  result,
  primary,
  secondary,
  onMessage,
}: ShareSummaryProps) {
  const [isSharing, setIsSharing] = useState(false);

  const topTensions = useMemo(() => {
    return dimensions
      .map((dimension) => {
        const score = result.dimensionScores[dimension.id];
        return {
          dimension,
          score,
          label: score >= 50 ? dimension.rightPole : dimension.leftPole,
        };
      })
      .sort((a, b) => Math.abs(b.score - 50) - Math.abs(a.score - 50))
      .slice(0, 3);
  }, [result.dimensionScores]);

  const shareUrl = useMemo(() => {
    const url = new URL(window.location.href);
    url.hash = "";
    return url.toString();
  }, []);

  const shareText = useMemo(() => {
    const tensionLines = topTensions
      .map((item) => `${item.dimension.shortName}：${item.label} ${item.score}/100`)
      .join("\n");

    return [
      "【公司人格图鉴】",
      `昵称：${result.nickname}`,
      `主原型：${primary.name}｜${primary.englishName}`,
      `副原型：${secondary.name}`,
      `主原型匹配度：${Math.round(result.matchScores[primary.id] * 100)}%`,
      "关键倾向：",
      tensionLines,
      "本结果仅供娱乐和团队交流。",
      `测试链接：${shareUrl}`,
    ].join("\n");
  }, [primary, result, secondary, shareUrl, topTensions]);

  async function writeClipboard(text: string) {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return;
    }

    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "true");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }

  async function createShareImage() {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1350;
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas is unavailable");

    const gradient = context.createLinearGradient(0, 0, 1080, 1350);
    gradient.addColorStop(0, "#f4f5f2");
    gradient.addColorStop(1, "#e5efeb");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 1080, 1350);

    const image = new Image();
    image.src = primary.imagePath;
    await image.decode();
    context.drawImage(image, 170, 110, 740, 740);

    context.fillStyle = "#22303a";
    context.font = "700 54px 'Microsoft YaHei', sans-serif";
    context.fillText(primary.name, 170, 975);
    context.font = "400 36px 'Microsoft YaHei', sans-serif";
    context.fillStyle = "#52606b";
    context.fillText(`${primary.englishName}｜${primary.nickname}`, 170, 1030);
    context.fillStyle = "#0f766e";
    context.font = "700 42px 'Microsoft YaHei', sans-serif";
    context.fillText(`主原型匹配度 ${Math.round(result.matchScores[primary.id] * 100)}%`, 170, 1110);
    context.fillStyle = "#52606b";
    context.font = "400 34px 'Microsoft YaHei', sans-serif";
    context.fillText(`副原型：${secondary.name}`, 170, 1165);
    context.fillText("公司人格图鉴｜仅供娱乐和团队交流", 170, 1230);

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to create share image"));
      }, "image/png");
    });
  }

  async function nativeShare() {
    setIsSharing(true);
    try {
      const blob = await createShareImage();
      const file = new File([blob], "company-persona.png", { type: "image/png" });
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], text: shareText, url: shareUrl });
      } else {
        await navigator.share({ title: "公司人格图鉴", text: shareText, url: shareUrl });
      }
    } catch (error) {
      if (!(error instanceof Error && error.name === "AbortError")) {
        await writeClipboard(shareText);
        onMessage("当前浏览器不支持原生分享，已复制摘要");
      }
    } finally {
      setIsSharing(false);
    }
  }

  async function copySummary() {
    await writeClipboard(shareText);
    onMessage("分享摘要已复制");
  }

  async function copyLink() {
    await writeClipboard(shareUrl);
    onMessage("测试链接已复制");
  }

  return (
    <section className="panel share-summary">
      <div className="share-summary-main">
        <img src={primary.imagePath} alt={`${primary.name}人格形象`} loading="lazy" />
        <div>
          <p className="eyebrow">分享摘要</p>
          <h2>{primary.name}</h2>
          <p className="share-subtitle">
            {primary.englishName}｜{primary.nickname}
          </p>
          <div className="share-tags">
            <span>主原型 {Math.round(result.matchScores[primary.id] * 100)}%</span>
            <span>副原型 {secondary.name}</span>
          </div>
        </div>
      </div>

      <div className="share-tensions">
        {topTensions.map((item) => (
          <div key={item.dimension.id}>
            <span>{item.dimension.shortName}</span>
            <strong>{item.label}</strong>
            <b>{item.score}</b>
          </div>
        ))}
      </div>

      <div className="share-actions">
        <button className="button primary" type="button" onClick={nativeShare} disabled={isSharing}>
          <Share2 aria-hidden="true" />
          {isSharing ? "生成中…" : "分享图片"}
        </button>
        <button className="button ghost" type="button" onClick={copySummary}>
          <Copy aria-hidden="true" />
          复制摘要
        </button>
        <button className="button ghost" type="button" onClick={copyLink}>
          <Link2 aria-hidden="true" />
          复制链接
        </button>
      </div>

      <p className="share-note">
        <Check aria-hidden="true" />
        手机端可分享生成的人格摘要图；桌面端会自动复制文字摘要。
      </p>
    </section>
  );
}
