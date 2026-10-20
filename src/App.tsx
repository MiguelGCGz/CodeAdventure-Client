const worlds = [
  { number: "01", title: "Pensamento lógico", icon: "🧩", color: "peach" },
  { number: "02", title: "A magia dos algoritmos", icon: "🗺️", color: "blue" },
  { number: "03", title: "Decisões inteligentes", icon: "🔀", color: "lilac" },
  { number: "04", title: "O poder das repetições", icon: "🔁", color: "mint" },
  { number: "05", title: "Programar com blocos", icon: "🧱", color: "yellow" },
  { number: "06", title: "Primeiros passos no código", icon: "💻", color: "pink" },
];

function App() {
  return (
    <>
      <header className="site-header">
        <a className="brand" href="#inicio" aria-label="CodeAdventure — início">
          <span className="brand-mark" aria-hidden="true">✦</span>
          <span>Code<span className="brand-accent">Adventure</span></span>
        </a>
        <nav aria-label="Navegação principal">
          <a href="#mundos">A aventura</a>
          <a href="#como-funciona">Como funciona</a>
        </nav>
        <a className="header-cta" href="#mundos">Vamos começar <span aria-hidden="true">→</span></a>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-copy">
            <p className="eyebrow"><span aria-hidden="true">✦</span> APRENDER A PROGRAMAR PODE SER UMA AVENTURA</p>
            <h1>Pequenos passos.<br /><span>Grandes ideias.</span></h1>
            <p className="hero-description">
              Resolve desafios, ajuda personagens e descobre como a programação
              transforma ideias em coisas incríveis.
            </p>
            <a className="primary-button" href="#mundos">Explorar a aventura <span aria-hidden="true">→</span></a>
            <div className="hero-note"><span aria-hidden="true">🌱</span> Aprende ao teu ritmo, um desafio de cada vez.</div>
          </div>
          <div className="hero-art" aria-label="Ilustração de um pequeno robô explorador">
            <div className="orbit orbit-one" />
            <div className="orbit orbit-two" />
            <span className="spark spark-one" aria-hidden="true">✦</span>
            <span className="spark spark-two" aria-hidden="true">✦</span>
            <span className="planet" aria-hidden="true">🪐</span>
            <div className="robot" aria-hidden="true">
              <div className="robot-antenna" />
              <div className="robot-face"><span /><span /></div>
              <div className="robot-mouth" />
              <div className="robot-body"><span>CA</span></div>
              <div className="robot-arm robot-arm-left" />
              <div className="robot-arm robot-arm-right" />
              <div className="robot-foot robot-foot-left" />
              <div className="robot-foot robot-foot-right" />
            </div>
            <div className="floating-card"><span aria-hidden="true">🧠</span><span>Ideias em ação!</span></div>
          </div>
        </section>

        <section className="worlds-section" id="mundos">
          <div className="section-heading">
            <div>
              <p className="eyebrow">O TEU MAPA DE DESCOBERTAS</p>
              <h2>Seis mundos, <span>mil ideias.</span></h2>
            </div>
            <p>Cada mundo ensina uma nova forma de pensar.<br className="desktop-break" /> A aventura começa com lógica e cresce contigo.</p>
          </div>
          <div className="world-grid">
            {worlds.map((world) => (
              <article className={`world-card ${world.color}`} key={world.number}>
                <span className="world-number">MUNDO {world.number}</span>
                <span className="world-icon" aria-hidden="true">{world.icon}</span>
                <h3>{world.title}</h3>
                <span className="world-arrow" aria-hidden="true">↗</span>
              </article>
            ))}
          </div>
        </section>

        <section className="how-section" id="como-funciona">
          <div className="how-icon" aria-hidden="true">🚀</div>
          <div>
            <p className="eyebrow">SEM PRESSA, SEM COMPLICAÇÕES</p>
            <h2>Experimenta. Descobre. <span>Consegue!</span></h2>
            <p>Desafios visuais e explicações simples ajudam-te a aprender fazendo.</p>
          </div>
          <a className="text-link" href="#mundos">Ver os mundos <span aria-hidden="true">→</span></a>
        </section>
      </main>

      <footer>
        <a className="brand footer-brand" href="#inicio">
          <span className="brand-mark" aria-hidden="true">✦</span>
          <span>Code<span className="brand-accent">Adventure</span></span>
        </a>
        <p>Feito para mentes curiosas e grandes aventuras.</p>
      </footer>
    </>
  );
}

export default App;
