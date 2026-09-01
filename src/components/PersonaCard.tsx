import type { Persona } from "../lib/types";

interface PersonaCardProps {
  persona: Persona;
  secondaryPersona: Persona;
  matchScore: number;
  nickname: string;
}

export default function PersonaCard({
  persona,
  secondaryPersona,
  matchScore,
  nickname,
}: PersonaCardProps) {
  return (
    <section className="persona-card">
      <figure className="persona-visual" aria-label={`${persona.name}人格形象`}>
        <img
          src={persona.imagePath}
          alt={`${persona.name}人格形象`}
          loading="lazy"
          decoding="async"
          draggable={false}
        />
      </figure>

      <div className="persona-body">
        <div className="persona-identity">
          <span className="persona-id">{persona.id}</span>
          <div>
            <h2>{persona.name}</h2>
            <p>{persona.englishName}｜{persona.nickname}</p>
          </div>
        </div>

        <p className="persona-description">
          {nickname}，{persona.description}你的副原型倾向是
          <strong>{secondaryPersona.name}</strong>。
        </p>

        <div className="match-row">
          <span>主原型匹配度</span>
          <strong>{Math.round(matchScore * 100)}%</strong>
        </div>
      </div>
    </section>
  );
}
