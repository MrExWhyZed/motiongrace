import { useState, useEffect, useRef } from "react";

const reelItems = [
  {
    id: 1,
    category: "Fragrance",
    title: "Nocturne Parfum",
    client: "Maison Élite",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683702?w=800&q=80",
    accent: "#C9A96E",
    accentRgb: "201,169,110",
    tag: "01",
    description: "An olfactory journey into darkness and desire.",
  },
  {
    id: 2,
    category: "Skincare",
    title: "Lumière Serum",
    client: "Glacé Beauty",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80",
    accent: "#7DD3FC",
    accentRgb: "125,211,252",
    tag: "02",
    description: "Clinical precision meets crystalline purity.",
  },
  {
    id: 3,
    category: "Cosmetics",
    title: "Velvet Lip Kit",
    client: "Rouge Atelier",
    image: "https://images.unsplash.com/photo-1586495777744-4e6232bf6868?w=800&q=80",
    accent: "#C084FC",
    accentRgb: "192,132,252",
    tag: "03",
    description: "Couture colour for the unapologetically bold.",
  },
  {
    id: 4,
    category: "Haircare",
    title: "Aura Oil",
    client: "Silk & Stone",
    image: "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=800&q=80",
    accent: "#C9A96E",
    accentRgb: "201,169,110",
    tag: "04",
    description: "Botanical intelligence, pure radiance.",
  },
];

function useInView(threshold = 0.1) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
}

function CinemaCard({ item, index, variant = "default" }) {
  const [hovered, setHovered] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const cardRef = useRef(null);
  const { ref: revealRef, inView } = useInView(0.08);

  const handleMouseMove = (e) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    setMousePos({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height,
    });
  };

  const setRef = (el) => {
    cardRef.current = el;
    revealRef.current = el;
  };

  const tiltX = hovered ? (mousePos.y - 0.5) * -6 : 0;
  const tiltY = hovered ? (mousePos.x - 0.5) * 6 : 0;

  const isHero = variant === "hero";
  const isWide = variant === "wide";

  return (
    <div
      ref={setRef}
      style={{
        position: "relative",
        borderRadius: "20px",
        overflow: "hidden",
        cursor: "pointer",
        height: isHero ? "100%" : isWide ? "320px" : "300px",
        minHeight: isHero ? "600px" : isWide ? "280px" : "260px",
        opacity: inView ? 1 : 0,
        transform: inView
          ? `perspective(1200px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(0px)`
          : "translateY(60px)",
        transition: inView
          ? `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${index * 120}ms, transform ${hovered ? "0.1s ease-out" : `0.9s cubic-bezier(0.16,1,0.3,1) ${index * 120}ms`}`
          : "none",
        willChange: "transform",
        transformStyle: "preserve-3d",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); setMousePos({ x: 0.5, y: 0.5 }); }}
      onMouseMove={handleMouseMove}
    >
      {/* Background image */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          transform: hovered ? "scale(1.08)" : "scale(1.01)",
          transition: "transform 2.4s cubic-bezier(0.16,1,0.3,1)",
        }}
      >
        <img
          src={item.image}
          alt={item.title}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
        />
      </div>

      {/* Grain texture */}
      <div style={{
        position: "absolute",
        inset: 0,
        opacity: 0.04,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        backgroundSize: "120px",
        mixBlendMode: "overlay",
        pointerEvents: "none",
      }} />

      {/* Bottom gradient */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(to top, rgba(3,3,6,0.96) 0%, rgba(3,3,6,0.55) 35%, rgba(3,3,6,0.1) 65%, transparent 100%)`,
      }} />

      {/* Top gradient */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(to bottom, rgba(3,3,6,0.4) 0%, transparent 30%)`,
      }} />

      {/* Accent spotlight */}
      <div style={{
        position: "absolute",
        inset: 0,
        background: `radial-gradient(circle at ${mousePos.x * 100}% ${mousePos.y * 100}%, rgba(${item.accentRgb},0.15) 0%, transparent 55%)`,
        opacity: hovered ? 1 : 0,
        transition: "opacity 0.5s ease",
        pointerEvents: "none",
      }} />

      {/* Border */}
      <div style={{
        position: "absolute",
        inset: 0,
        borderRadius: "20px",
        boxShadow: hovered
          ? `inset 0 0 0 1px rgba(${item.accentRgb},0.4), 0 40px 80px rgba(0,0,0,0.7)`
          : `inset 0 0 0 1px rgba(255,255,255,0.07)`,
        transition: "box-shadow 0.6s ease",
        pointerEvents: "none",
      }} />

      {/* Top row */}
      <div style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        padding: "20px 22px",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
      }}>
        <span style={{
          fontFamily: "'Courier New', monospace",
          fontSize: "10px",
          letterSpacing: "0.3em",
          color: `rgba(${item.accentRgb},0.6)`,
          opacity: hovered ? 1 : 0.45,
          transition: "opacity 0.5s ease",
        }}>
          {item.tag}
        </span>
        <span style={{
          fontSize: "8px",
          fontWeight: 700,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          padding: "6px 12px",
          borderRadius: "100px",
          background: `rgba(${item.accentRgb},0.1)`,
          color: item.accent,
          border: `1px solid rgba(${item.accentRgb},0.22)`,
          backdropFilter: "blur(12px)",
          opacity: hovered ? 1 : 0.65,
          transition: "opacity 0.5s ease",
        }}>
          {item.category}
        </span>
      </div>

      {/* Bottom content */}
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        padding: "24px 24px 26px",
      }}>
        {/* Accent bar */}
        <div style={{
          height: "1px",
          background: `linear-gradient(to right, rgba(${item.accentRgb},0.7), transparent)`,
          width: hovered ? "55%" : "20px",
          marginBottom: "14px",
          transition: "width 0.7s cubic-bezier(0.16,1,0.3,1)",
        }} />

        <h3 style={{
          fontFamily: "'Georgia', 'Times New Roman', serif",
          fontSize: isHero ? "clamp(1.5rem, 2.2vw, 2rem)" : "1.15rem",
          fontWeight: 900,
          color: "#fff",
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
          marginBottom: "8px",
          transform: hovered ? "translateY(-2px)" : "translateY(0)",
          transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1)",
        }}>
          {item.title}
        </h3>

        {isHero && (
          <p style={{
            fontSize: "11px",
            color: "rgba(255,255,255,0.45)",
            letterSpacing: "0.04em",
            marginBottom: "14px",
            lineHeight: 1.5,
            maxWidth: "240px",
            opacity: hovered ? 1 : 0,
            transform: hovered ? "translateY(0)" : "translateY(6px)",
            transition: "opacity 0.6s ease 80ms, transform 0.6s ease 80ms",
          }}>
            {item.description}
          </p>
        )}

        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          opacity: hovered ? 1 : 0.45,
          transform: hovered ? "translateY(0)" : "translateY(4px)",
          transition: "opacity 0.5s ease 60ms, transform 0.5s ease 60ms",
        }}>
          <p style={{
            fontFamily: "'Courier New', monospace",
            fontSize: "10px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.4)",
          }}>
            {item.client}
          </p>
          {(isHero || isWide) && (
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              transform: hovered ? "translateX(0)" : "translateX(10px)",
              transition: "transform 0.5s cubic-bezier(0.16,1,0.3,1) 80ms",
            }}>
              <span style={{
                fontSize: "9px",
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: item.accent,
                fontFamily: "'Courier New', monospace",
              }}>View</span>
              <div style={{
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                background: `rgba(${item.accentRgb},0.12)`,
                border: `1px solid rgba(${item.accentRgb},0.3)`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h14M12 5l7 7-7 7" stroke={item.accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShowreelSection() {
  const { ref: headerRef, inView: headerVisible } = useInView(0.15);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #060608 0%, #0a0a0f 40%, #07070c 100%)",
      fontFamily: "'Georgia', serif",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,600;0,700;1,300;1,600&family=DM+Mono:wght@300;400;500&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #060608; }
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #060608; }
        ::-webkit-scrollbar-thumb { background: rgba(201,169,110,0.3); border-radius: 2px; }
        .grid-showreel {
          display: grid;
          grid-template-columns: 1fr;
          gap: 12px;
        }
        @media (min-width: 640px) {
          .grid-showreel {
            grid-template-columns: 1fr 1fr;
          }
        }
        @media (min-width: 1024px) {
          .grid-showreel {
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-rows: auto auto;
          }
          .card-hero {
            grid-row: 1 / 3;
            grid-column: 1 / 2;
          }
          .card-2 { grid-column: 2 / 3; grid-row: 1 / 2; }
          .card-3 { grid-column: 3 / 4; grid-row: 1 / 2; }
          .card-wide { grid-column: 2 / 4; grid-row: 2 / 3; }
        }
      `}</style>

      <section style={{
        padding: "80px 24px 120px",
        maxWidth: "1320px",
        margin: "0 auto",
        position: "relative",
      }}>

        {/* Ambient glows */}
        <div style={{
          position: "fixed",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "900px",
          height: "500px",
          background: "radial-gradient(ellipse, rgba(201,169,110,0.03) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>

          {/* Divider */}
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "20px",
            marginBottom: "72px",
          }}>
            <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.06)" }} />
            <span style={{
              fontFamily: "'DM Mono', 'Courier New', monospace",
              fontSize: "9px",
              letterSpacing: "0.35em",
              textTransform: "uppercase",
              color: "rgba(201,169,110,0.35)",
            }}>
              Portfolio · 2024
            </span>
            <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.06)" }} />
          </div>

          {/* Header */}
          <div
            ref={headerRef}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "40px",
              marginBottom: "56px",
            }}
          >
            {/* Eyebrow */}
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              opacity: headerVisible ? 1 : 0,
              transform: headerVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.9s ease, transform 0.9s ease",
            }}>
              <div style={{
                width: "32px",
                height: "1px",
                background: "rgba(201,169,110,0.5)",
              }} />
              <span style={{
                fontFamily: "'DM Mono', 'Courier New', monospace",
                fontSize: "9px",
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "rgba(201,169,110,0.7)",
              }}>
                Selected Work
              </span>
            </div>

            <div style={{
              display: "flex",
              flexWrap: "wrap",
              alignItems: "flex-end",
              justifyContent: "space-between",
              gap: "32px",
            }}>
              {/* Headline */}
              <h2 style={{
                fontFamily: "'Cormorant Garamond', 'Georgia', serif",
                fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
                fontWeight: 700,
                letterSpacing: "-0.025em",
                lineHeight: 1.0,
                color: "#f0ece4",
                opacity: headerVisible ? 1 : 0,
                transform: headerVisible ? "translateY(0)" : "translateY(28px)",
                transition: "opacity 1s ease 80ms, transform 1s ease 80ms",
              }}>
                See What's{" "}
                <em style={{
                  fontStyle: "italic",
                  background: "linear-gradient(135deg, #B8935A 0%, #E8D4A0 42%, #C9A96E 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  Possible
                </em>
              </h2>

              {/* Stats + description */}
              <div style={{
                opacity: headerVisible ? 1 : 0,
                transform: headerVisible ? "translateY(0)" : "translateY(20px)",
                transition: "opacity 1s ease 200ms, transform 1s ease 200ms",
                maxWidth: "340px",
              }}>
                <p style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: "15px",
                  fontWeight: 300,
                  fontStyle: "italic",
                  lineHeight: 1.7,
                  letterSpacing: "0.02em",
                  color: "rgba(240,236,228,0.45)",
                  marginBottom: "20px",
                }}>
                  Where beauty meets computation. Every pixel, intentional.
                </p>
                <div style={{ display: "flex", gap: "28px" }}>
                  {[
                    { num: "04", label: "Projects" },
                    { num: "03", label: "Brands" },
                    { num: "100+", label: "Assets" },
                  ].map(({ num, label }) => (
                    <div key={label} style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                      <span style={{
                        fontFamily: "'Cormorant Garamond', serif",
                        fontSize: "20px",
                        fontWeight: 600,
                        color: "rgba(201,169,110,0.8)",
                        lineHeight: 1,
                      }}>{num}</span>
                      <span style={{
                        fontFamily: "'DM Mono', 'Courier New', monospace",
                        fontSize: "8px",
                        letterSpacing: "0.2em",
                        textTransform: "uppercase",
                        color: "rgba(255,255,255,0.25)",
                      }}>{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Bento Grid */}
          <div className="grid-showreel">
            <div className="card-hero">
              <CinemaCard item={reelItems[0]} index={0} variant="hero" />
            </div>
            <div className="card-2">
              <CinemaCard item={reelItems[1]} index={1} variant="default" />
            </div>
            <div className="card-3">
              <CinemaCard item={reelItems[2]} index={2} variant="default" />
            </div>
            <div className="card-wide">
              <CinemaCard item={reelItems[3]} index={3} variant="wide" />
            </div>
          </div>

          {/* Footer line */}
          <div style={{
            marginTop: "48px",
            display: "flex",
            alignItems: "center",
            opacity: headerVisible ? 1 : 0,
            transition: "opacity 1.2s ease 700ms",
          }}>
            <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.04)" }} />
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "0 24px",
            }}>
              {["CGI", "3D", "Motion"].map((t, i) => (
                <span key={t} style={{
                  fontFamily: "'DM Mono', 'Courier New', monospace",
                  fontSize: "8px",
                  letterSpacing: "0.3em",
                  textTransform: "uppercase",
                  color: "rgba(201,169,110,0.3)",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}>
                  {t}
                  {i < 2 && <span style={{ display: "inline-block", width: "3px", height: "3px", borderRadius: "50%", background: "rgba(201,169,110,0.2)" }} />}
                </span>
              ))}
            </div>
            <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.04)" }} />
          </div>

        </div>
      </section>
    </div>
  );
}