import confetti from "canvas-confetti";
import { useEffect, useState } from "react";
import {
  getLevelChallenge,
  submitLevelAnswer,
  type DashboardWorld,
  type Direction,
  type LevelChallenge,
  type LevelSubmissionResult,
} from "./api";

interface WorldGameProps {
  world: DashboardWorld;
  nextWorld: DashboardWorld | null;
  onBack: () => void;
  onNextWorld: (worldId: number) => void;
  onProgressUpdated: () => Promise<void>;
}

const directionDetails: Record<Direction, { label: string; symbol: string }> = {
  up: { label: "Cima", symbol: "↑" },
  down: { label: "Baixo", symbol: "↓" },
  left: { label: "Esquerda", symbol: "←" },
  right: { label: "Direita", symbol: "→" },
};

function getPathPositions(
  challenge: Extract<LevelChallenge, { challenge_type: "path_commands" }>["challenge"],
  commands: Direction[],
): [number, number][] {
  const positions: [number, number][] = [challenge.start];
  for (const command of commands) {
    const [row, column] = positions[positions.length - 1];
    const delta: Record<Direction, [number, number]> = {
      up: [-1, 0],
      down: [1, 0],
      left: [0, -1],
      right: [0, 1],
    };
    positions.push([row + delta[command][0], column + delta[command][1]]);
  }
  return positions;
}

function errorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Ocorreu um erro. Tenta novamente.";
}

function VictoryEffect() {
  useEffect(() => {
    const options = {
      particleCount: 95,
      spread: 78,
      startVelocity: 48,
      gravity: 0.9,
      ticks: 180,
      disableForReducedMotion: true,
      colors: ["#6b55d9", "#ffbd59", "#ff7e84", "#61cda3", "#78b8fa"],
    };
    confetti({ ...options, origin: { x: 0.12, y: 0.68 } });
    confetti({ ...options, origin: { x: 0.88, y: 0.68 } });
    const timeout = window.setTimeout(() => {
      confetti({ ...options, particleCount: 120, spread: 105, origin: { x: 0.5, y: 0.55 } });
    }, 380);
    return () => window.clearTimeout(timeout);
  }, []);

  return (
    <div aria-hidden="true" className="victory-decoration">
      <span className="victory-rocket rocket-left">🚀</span>
      <span className="victory-rocket rocket-right">🚀</span>
      <span className="victory-star star-left">✦</span>
      <span className="victory-star star-right">✦</span>
    </div>
  );
}

function WorldGame({
  world,
  nextWorld,
  onBack,
  onNextWorld,
  onProgressUpdated,
}: WorldGameProps) {
  const [selectedLevelId, setSelectedLevelId] = useState<number | null>(null);
  const [challenge, setChallenge] = useState<LevelChallenge | null>(null);
  const [challengeError, setChallengeError] = useState("");
  const [isLoadingChallenge, setIsLoadingChallenge] = useState(false);
  const [choice, setChoice] = useState("");
  const [commands, setCommands] = useState<Direction[]>([]);
  const [animatedStep, setAnimatedStep] = useState<number | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [result, setResult] = useState<LevelSubmissionResult | null>(null);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (selectedLevelId === null) return;
    let active = true;
    setIsLoadingChallenge(true);
    setChallengeError("");
    setChallenge(null);
    setResult(null);
    setChoice("");
    setCommands([]);
    setAnimatedStep(null);
    getLevelChallenge(selectedLevelId)
      .then((levelChallenge) => {
        if (active) setChallenge(levelChallenge);
      })
      .catch((error: unknown) => {
        if (active) setChallengeError(errorMessage(error));
      })
      .finally(() => {
        if (active) setIsLoadingChallenge(false);
      });
    return () => {
      active = false;
    };
  }, [selectedLevelId]);

  async function checkAnswer(answer: string | Direction[]) {
    if (challenge === null) return;
    setIsSubmitting(true);
    setIsAnimating(challenge.challenge_type === "path_commands");
    setSubmitError("");
    setResult(null);
    try {
      if (challenge.challenge_type === "path_commands" && Array.isArray(answer)) {
        const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const stepDuration = reducedMotion ? 90 : 360;
        setAnimatedStep(0);
        for (let step = 1; step <= answer.length; step += 1) {
          await new Promise((resolve) => window.setTimeout(resolve, stepDuration));
          setAnimatedStep(step);
        }
      }
      const submission = await submitLevelAnswer(challenge.id, answer);
      setResult(submission);
      if (!submission.correct && challenge.challenge_type === "path_commands") {
        window.setTimeout(() => setAnimatedStep(0), 500);
      }
      if (submission.correct && !submission.already_completed) {
        await onProgressUpdated();
      }
    } catch (error) {
      setSubmitError(errorMessage(error));
    } finally {
      setIsAnimating(false);
      setIsSubmitting(false);
    }
  }

  function addCommand(command: Direction) {
    if (challenge?.challenge_type !== "path_commands") return;
    if (commands.length >= challenge.challenge.max_commands) return;
    setCommands((current) => [...current, command]);
    setResult(null);
    setSubmitError("");
  }

  function renderChallenge() {
    if (challenge === null) return null;
    if (challenge.challenge_type === "sequence_choice") {
      return (
        <div className="sequence-game">
          <div className="sequence-pattern" aria-label="Sequência do desafio">
            {challenge.challenge.pattern.map((item, index) => (
              <span className="sequence-item" key={`${item}-${index}`}>{item}</span>
            ))}
          </div>
          <p className="game-prompt">Que número vem a seguir?</p>
          <div className="choice-grid">
            {challenge.challenge.choices.map((answer) => (
              <button
                aria-pressed={choice === answer}
                className={`choice-button ${choice === answer ? "selected" : ""}`}
                key={answer}
                onClick={() => { setChoice(answer); setResult(null); setSubmitError(""); }}
                type="button"
              >
                {answer}
              </button>
            ))}
          </div>
          <button
            className="primary-button game-submit"
            disabled={!choice || isSubmitting}
            onClick={() => void checkAnswer(choice)}
            type="button"
          >
            {isSubmitting ? "A verificar..." : "Verificar resposta"}
          </button>
        </div>
      );
    }

    if (challenge.challenge_type !== "path_commands") {
      return <p className="game-message">Este desafio estará disponível em breve.</p>;
    }

    const pathPositions = getPathPositions(challenge.challenge, commands);
    const [robotRow, robotColumn] = pathPositions[
      animatedStep === null ? 0 : Math.min(animatedStep, pathPositions.length - 1)
    ];
    return (
      <div className="path-game">
        <p className="game-prompt">Guia o explorador até à estrela sem tocar nas pedras.</p>
        <div
          aria-label={`Labirinto: robô na linha ${robotRow + 1}, coluna ${robotColumn + 1}`}
          className="maze-grid"
          style={{ gridTemplateColumns: `repeat(${challenge.challenge.columns}, minmax(0, 1fr))` }}
          role="group"
        >
          {Array.from({ length: challenge.challenge.rows * challenge.challenge.columns }, (_, index) => {
            const position: [number, number] = [
              Math.floor(index / challenge.challenge.columns),
              index % challenge.challenge.columns,
            ];
            const isStart = position[0] === challenge.challenge.start[0] && position[1] === challenge.challenge.start[1];
            const isGoal = position[0] === challenge.challenge.goal[0] && position[1] === challenge.challenge.goal[1];
            const isWall = challenge.challenge.walls.some(([row, column]) => row === position[0] && column === position[1]);
            const pathIndex = pathPositions.findIndex(([row, column]) => row === position[0] && column === position[1]);
            return (
              <span
                className={`maze-cell ${isWall ? "wall" : ""} ${pathIndex >= 0 ? "visited" : ""}`}
                key={`${position[0]}-${position[1]}`}
              >
                {isWall ? "🪨" : isGoal ? "⭐" : isStart ? "🏁" : pathIndex > 0 ? pathIndex : ""}
              </span>
            );
          })}
          <span
            aria-label="Explorador"
            className={`maze-explorer ${isAnimating ? "moving" : ""}`}
            role="img"
            style={{
              left: `${robotColumn * (100 / challenge.challenge.columns)}%`,
              top: `${robotRow * (100 / challenge.challenge.rows)}%`,
              width: `${100 / challenge.challenge.columns}%`,
              height: `${100 / challenge.challenge.rows}%`,
            }}
          >
            🤖
          </span>
        </div>
        <p className="command-count">Instruções: {commands.length}/{challenge.challenge.max_commands}</p>
        <div className="direction-pad" aria-label="Adicionar instrução">
          {(["up", "left", "down", "right"] as const).map((direction) => (
            <button
              aria-label={`Mover ${directionDetails[direction].label.toLowerCase()}`}
              disabled={commands.length >= challenge.challenge.max_commands || isSubmitting}
              key={direction}
              onClick={() => addCommand(direction)}
              type="button"
            >
              {directionDetails[direction].symbol} <span>{directionDetails[direction].label}</span>
            </button>
          ))}
        </div>
        <div className="command-list" aria-live="polite">
          {commands.length === 0
            ? <span>As tuas instruções vão aparecer aqui.</span>
            : commands.map((command, index) => (
              <span className="command-chip" key={`${command}-${index}`}>
                {directionDetails[command].symbol} {directionDetails[command].label}
              </span>
            ))}
        </div>
        <div className="path-actions">
          <button
            className="secondary-button"
            disabled={commands.length === 0 || isSubmitting}
            onClick={() => { setCommands((current) => current.slice(0, -1)); setResult(null); }}
            type="button"
          >
            Apagar último
          </button>
          <button
            className="secondary-button"
            disabled={commands.length === 0 || isSubmitting}
            onClick={() => { setCommands([]); setResult(null); setSubmitError(""); }}
            type="button"
          >
            Recomeçar
          </button>
          <button
            className="primary-button game-submit"
            disabled={commands.length === 0 || isSubmitting}
            onClick={() => void checkAnswer(commands)}
            type="button"
          >
            {isAnimating ? "O explorador está a caminho..." : isSubmitting ? "A verificar..." : "Executar"}
          </button>
        </div>
      </div>
    );
  }

  const selectedLevel = world.levels.find((level) => level.id === selectedLevelId);

  return (
    <section className="world-detail" aria-labelledby="world-detail-title">
      <button
        className="back-button"
        onClick={() => selectedLevelId === null ? onBack() : setSelectedLevelId(null)}
        type="button"
      >
        <span aria-hidden="true">←</span> {selectedLevelId === null ? "Voltar ao mapa" : `Voltar a ${world.title}`}
      </button>

      {selectedLevelId === null ? (
        <>
          <div className={`world-detail-hero ${world.theme_color}`}>
            <span className="world-detail-icon" aria-hidden="true">{world.icon}</span>
            <div>
              <p className="eyebrow">MUNDO {String(world.id).padStart(2, "0")}</p>
              <h2 id="world-detail-title">{world.title}</h2>
              <p>{world.description}</p>
            </div>
          </div>
          <h3 className="level-list-title">Desafios deste mundo</h3>
          <div className="level-list">
            {world.levels.map((level, index) => (
              <article className={`level-list-item level-${level.status}`} key={level.id}>
                <span className="level-number">{String(index + 1).padStart(2, "0")}</span>
                <div className="level-list-copy">
                  <strong>{level.title}</strong>
                  <span>{level.objective}</span>
                </div>
                {level.status === "completed" && (
                  <span className="level-stars" aria-label={`${level.stars} estrelas`}>
                    {"★".repeat(level.stars ?? 0)}
                  </span>
                )}
                <button
                  className="secondary-button level-action"
                  disabled={level.status === "locked" || level.challenge_type === "coming_soon"}
                  onClick={() => setSelectedLevelId(level.id)}
                  type="button"
                >
                  {level.status === "locked"
                    ? "Bloqueado"
                    : level.challenge_type === "coming_soon"
                      ? "Em breve"
                      : level.status === "completed"
                        ? "Rever desafio"
                        : "Começar desafio"}
                </button>
              </article>
            ))}
          </div>
          {world.status === "completed" && nextWorld && (
            <button
              className="primary-button next-world-button"
              onClick={() => onNextWorld(nextWorld.id)}
              type="button"
            >
              Próximo mundo: {nextWorld.title} <span aria-hidden="true">→</span>
            </button>
          )}
        </>
      ) : (
        <div className="challenge-panel">
          <p className="eyebrow">{world.title.toLocaleUpperCase("pt-PT")}</p>
          <h2 id="world-detail-title">{selectedLevel?.title ?? "Desafio"}</h2>
          {isLoadingChallenge && <p className="game-message" role="status">A preparar o desafio...</p>}
          {challengeError && <p className="dashboard-error" role="alert">{challengeError}</p>}
          {challenge && (
            <>
              <p className="challenge-objective">{challenge.objective}</p>
              {renderChallenge()}
              {submitError && <p className="dashboard-error" role="alert">{submitError}</p>}
              {result && (
                <div className={`game-result ${result.correct ? "success victory-result" : "try-again"}`} role="status">
                  {result.correct && !result.already_completed && <VictoryEffect />}
                  <span aria-hidden="true" className="victory-badge">{result.correct ? "🏆" : "💡"}</span>
                  <strong>{result.correct ? "Missão cumprida!" : "Quase lá!"}</strong>
                  <p>{result.message}</p>
                  {result.correct && (
                    <>
                      <p className="victory-rewards">
                        <span className="reward-stars" aria-label={`${result.stars} estrelas`}>
                          {"★".repeat(result.stars ?? 0)}
                        </span>
                        {result.xp_awarded > 0 && <span className="reward-xp">+{result.xp_awarded} XP</span>}
                        {result.already_completed && " · Resultado já guardado"}
                      </p>
                      {world.status === "completed" && nextWorld && (
                        <button
                          className="primary-button next-world-button"
                          onClick={() => onNextWorld(nextWorld.id)}
                          type="button"
                        >
                          Próximo mundo: {nextWorld.title} <span aria-hidden="true">→</span>
                        </button>
                      )}
                    </>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      )}
    </section>
  );
}

export default WorldGame;
