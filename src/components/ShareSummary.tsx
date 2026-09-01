import { Check, Copy, Link2, Share2 } from "lucide-react";
import QRCode from "qrcode";
import { useEffect, useMemo, useState } from "react";
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
  const [qrImageUrl, setQrImageUrl] = useState("");
  const [wechatShareImageUrl, setWechatShareImageUrl] = useState("");
  const [showWeChatShare, setShowWeChatShare] = useState(false);

  const isWeChat = useMemo(
    () => /MicroMessenger/i.test(window.navigator.userAgent),
    [],
  );

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

  useEffect(() => {
    let cancelled = false;

    QRCode.toDataURL(shareUrl, {
      width: 420,
      margin: 1,
      errorCorrectionLevel: "M",
      color: { dark: "#22303a", light: "#ffffff" },
    }).then(value => {
      if (!cancelled) setQrImageUrl(value);
    }).catch(() => {
      if (!cancelled) setQrImageUrl("");
    });

    return () => {
      cancelled = true;
    };
  }, [shareUrl]);

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

  async function createQrDataUrl() {
    return QRCode.toDataURL(shareUrl, {
      width: 420,
      margin: 1,
      errorCorrectionLevel: "M",
      color: { dark: "#22303a", light: "#ffffff" },
    });
  }

  async function loadImage(src: string) {
    const image = new Image();
    image.src = src;
    await image.decode();
    return image;
  }

  async function renderShareCanvas() {
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

    const image = await loadImage(primary.imagePath);
    const qrImage = await loadImage(await createQrDataUrl());
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

    // Keep a quiet area around the QR code for WeChat long-press recognition.
    context.fillStyle = "#ffffff";
    context.fillRect(742, 1056, 236, 236);
    context.strokeStyle = "#cfd5cf";
    context.lineWidth = 2;
    context.strokeRect(742, 1056, 236, 236);
    context.drawImage(qrImage, 760, 1074, 200, 200);
    context.fillStyle = "#52606b";
    context.font = "500 27px 'Microsoft YaHei', sans-serif";
    context.textAlign = "center";
    context.fillText("扫码打开测试", 860, 1324);
    context.textAlign = "left";

    return canvas;
  }

  async function createShareImage() {
    const canvas = await renderShareCanvas();

    return new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) resolve(blob);
        else reject(new Error("Failed to create share image"));
      }, "image/png");
    });
  }

  async function createShareImageUrl() {
    const canvas = await renderShareCanvas();
    return canvas.toDataURL("image/png");
  }

  async function nativeShare() {
    setIsSharing(true);
    try {
      if (isWeChat) {
        setWechatShareImageUrl(await createShareImageUrl());
        setShowWeChatShare(true);
        onMessage("请长按图片分享给朋友");
        return;
      }

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

      <div className="share-link-panel">
        {qrImageUrl ? (
          <img src={qrImageUrl} alt="打开公司人格测试的二维码" />
        ) : (
          <div className="share-qr-placeholder" aria-hidden="true" />
        )}
        <div>
          <span>扫码或点击打开</span>
          <a href={shareUrl} target="_blank" rel="noreferrer">
            {shareUrl}
          </a>
          <p>分享图右下角也包含此二维码，微信长按图片可直接识别。</p>
        </div>
      </div>

      <div className="share-actions">
        <button className="button primary" type="button" onClick={nativeShare} disabled={isSharing}>
          <Share2 aria-hidden="true" />
          {isSharing ? "生成中…" : isWeChat ? "生成微信分享图" : "分享图片"}
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
        手机端可分享带二维码的人格摘要图；桌面端可点击链接或复制摘要。
      </p>

      {showWeChatShare && (
        <div
          className="wechat-share-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="微信分享图"
          onClick={() => setShowWeChatShare(false)}
        >
          <section
            className="wechat-share-dialog"
            onClick={event => event.stopPropagation()}
          >
            <div>
              <h3>微信分享</h3>
              <button
                type="button"
                onClick={() => setShowWeChatShare(false)}
                aria-label="关闭微信分享图"
              >
                关闭
              </button>
            </div>
            <p>长按下方图片，选择“发送给朋友”或“保存图片”。</p>
            {wechatShareImageUrl && (
              <img
                src={wechatShareImageUrl}
                alt="公司人格分享图，右下角包含测试链接二维码"
              />
            )}
            <div>
              <a href={shareUrl} target="_blank" rel="noreferrer">
                直接打开测试链接
              </a>
              <button type="button" onClick={copyLink}>
                复制链接
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
