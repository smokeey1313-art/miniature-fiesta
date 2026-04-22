import { useState, useEffect, useRef, useCallback } from "react";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500&family=DM+Sans:wght@300;400;500;600&family=DM+Mono:wght@300;400&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #09090e;
    --bg2: #0f0f18;
    --bg3: #14141f;
    --card: #111119;
    --gold: #c9a96e;
    --gold2: #e8cfa0;
    --gold-dim: rgba(201,169,110,0.15);
    --cream: #f5f0e8;
    --cream2: #e8e0d0;
    --blue: #1a3a6e;
    --blue2: #2452a8;
    --muted: #6a6a82;
    --muted2: #9a9ab5;
    --border: rgba(201,169,110,0.18);
    --border2: rgba(255,255,255,0.06);
    --font-display: 'Cormorant Garamond', Georgia, serif;
    --font-body: 'DM Sans', system-ui, sans-serif;
    --font-mono: 'DM Mono', monospace;
    --radius: 4px;
    --radius2: 12px;
    --shadow: 0 25px 80px rgba(0,0,0,0.7);
  }

  html { scroll-behavior: smooth; overflow-x: hidden; }

  body {
    background: var(--bg);
    color: var(--cream);
    font-family: var(--font-body);
    font-size: 16px;
    line-height: 1.6;
    overflow-x: hidden;
  }

  ::selection { background: var(--gold); color: var(--bg); }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--gold); border-radius: 2px; }

  .grain {
    position: fixed; inset: 0; pointer-events: none; z-index: 999;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
    opacity: 0.4;
  }

  /* NAV */
  .nav { position: fixed; top: 0; left: 0; right: 0; z-index: 900; transition: all 0.5s ease; padding: 0 40px; }
  .nav.scrolled { background: rgba(9,9,14,0.95); backdrop-filter: blur(24px); border-bottom: 1px solid var(--border); }
  .nav-inner { max-width: 1400px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; height: 80px; }
  .nav-logo { font-family: var(--font-display); font-size: 22px; font-weight: 600; letter-spacing: 0.05em; color: var(--cream); text-decoration: none; display: flex; align-items: center; gap: 10px; }
  .logo-mark { width: 32px; height: 32px; background: linear-gradient(135deg, var(--gold), var(--gold2)); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 14px; color: var(--bg); font-weight: 700; }
  .nav-links { display: flex; align-items: center; gap: 36px; list-style: none; }
  .nav-links a { color: var(--muted2); text-decoration: none; font-size: 13px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; transition: color 0.2s; position: relative; }
  .nav-links a::after { content: ''; position: absolute; bottom: -4px; left: 0; right: 0; height: 1px; background: var(--gold); transform: scaleX(0); transition: transform 0.3s ease; transform-origin: left; }
  .nav-links a:hover { color: var(--gold); }
  .nav-links a:hover::after { transform: scaleX(1); }
  .btn-book-nav { background: linear-gradient(135deg, var(--gold), #b8955a); color: var(--bg); padding: 10px 24px; border-radius: var(--radius); font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; border: none; cursor: pointer; transition: all 0.3s; white-space: nowrap; }
  .btn-book-nav:hover { transform: translateY(-1px); box-shadow: 0 8px 30px rgba(201,169,110,0.4); }
  .mobile-menu-btn { display: none; background: none; border: 1px solid var(--border2); color: var(--cream); cursor: pointer; padding: 8px 12px; border-radius: 6px; font-size: 18px; }

  /* EMERGENCY BANNER */
  .emergency-banner { background: linear-gradient(90deg, #7a1515, #a01e1e, #7a1515); padding: 10px 40px; display: flex; align-items: center; justify-content: center; gap: 16px; font-size: 13px; letter-spacing: 0.04em; position: relative; z-index: 850; flex-wrap: wrap; }
  .emergency-banner .pulse { width: 8px; height: 8px; background: #ff6b6b; border-radius: 50%; animation: pulse-anim 1.5s infinite; flex-shrink: 0; }
  @keyframes pulse-anim { 0%,100% { box-shadow: 0 0 0 0 rgba(255,107,107,0.6); } 50% { box-shadow: 0 0 0 8px rgba(255,107,107,0); } }
  .emergency-banner a { color: #ffd4d4; font-weight: 600; text-decoration: none; }
  .emergency-banner a:hover { text-decoration: underline; }

  /* HERO */
  .hero { min-height: 100vh; display: flex; align-items: center; position: relative; overflow: hidden; padding: 120px 40px 80px; }
  .hero-bg { position: absolute; inset: 0; z-index: 0; background: radial-gradient(ellipse 80% 60% at 70% 50%, rgba(26,58,110,0.25) 0%, transparent 60%), radial-gradient(ellipse 50% 80% at 10% 80%, rgba(201,169,110,0.08) 0%, transparent 50%), linear-gradient(180deg, var(--bg) 0%, var(--bg2) 100%); }
  .hero-grid { position: absolute; inset: 0; z-index: 0; background-image: linear-gradient(rgba(201,169,110,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(201,169,110,0.04) 1px, transparent 1px); background-size: 60px 60px; mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%); }
  .hero-content { position: relative; z-index: 1; max-width: 1400px; margin: 0 auto; width: 100%; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
  .hero-eyebrow { display: inline-flex; align-items: center; gap: 10px; font-size: 11px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); margin-bottom: 24px; padding: 8px 16px; border: 1px solid var(--border); border-radius: 100px; background: var(--gold-dim); }
  .hero-title { font-family: var(--font-display); font-size: clamp(52px, 6vw, 88px); font-weight: 300; line-height: 1.0; color: var(--cream); margin-bottom: 28px; }
  .hero-title em { font-style: italic; color: var(--gold); }
  .hero-subtitle { font-size: 17px; color: var(--muted2); line-height: 1.75; max-width: 480px; margin-bottom: 44px; }
  .hero-ctas { display: flex; gap: 16px; align-items: center; flex-wrap: wrap; margin-bottom: 60px; }
  .btn-primary { background: linear-gradient(135deg, var(--gold), #b8955a); color: var(--bg); padding: 16px 36px; border-radius: var(--radius); font-size: 13px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; border: none; cursor: pointer; transition: all 0.3s; display: inline-flex; align-items: center; gap: 10px; }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 16px 48px rgba(201,169,110,0.35); }
  .btn-secondary { background: transparent; color: var(--cream); padding: 16px 36px; border-radius: var(--radius); font-size: 13px; font-weight: 500; letter-spacing: 0.08em; text-transform: uppercase; border: 1px solid var(--border2); cursor: pointer; transition: all 0.3s; display: inline-flex; align-items: center; gap: 10px; }
  .btn-secondary:hover { border-color: var(--gold); color: var(--gold); }
  .hero-stats { display: flex; gap: 48px; }
  .hero-stat-num { font-family: var(--font-display); font-size: 44px; font-weight: 600; color: var(--cream); line-height: 1; }
  .hero-stat-label { font-size: 12px; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; margin-top: 4px; }
  .hero-visual { position: relative; }
  .hero-card-main { background: var(--card); border: 1px solid var(--border); border-radius: 20px; overflow: hidden; position: relative; }
  .hero-card-img { width: 100%; height: 480px; background: linear-gradient(135deg, #1a2a4a 0%, #0d1a35 40%, #1a3a2a 100%); display: flex; align-items: center; justify-content: center; font-size: 80px; position: relative; overflow: hidden; }
  .hero-card-img::after { content: ''; position: absolute; inset: 0; background: linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.8) 100%); }
  .smile-icon-hero { font-size: 120px; opacity: 0.3; position: absolute; animation: float-hero 6s ease-in-out infinite; }
  @keyframes float-hero { 0%,100% { transform: translateY(0) rotate(-5deg); } 50% { transform: translateY(-20px) rotate(5deg); } }
  .hero-card-badge { position: absolute; top: 20px; right: 20px; z-index: 2; background: rgba(9,9,14,0.9); backdrop-filter: blur(12px); border: 1px solid var(--border); border-radius: 100px; padding: 8px 16px; font-size: 12px; font-weight: 600; color: var(--gold); letter-spacing: 0.08em; }
  .hero-floating-cards { position: absolute; left: -60px; top: 30%; display: flex; flex-direction: column; gap: 12px; }
  .floating-card { background: rgba(15,15,24,0.95); backdrop-filter: blur(20px); border: 1px solid var(--border); border-radius: 12px; padding: 14px 18px; display: flex; align-items: center; gap: 12px; min-width: 200px; animation: float-card 4s ease-in-out infinite; }
  .floating-card:nth-child(2) { animation-delay: -2s; margin-left: 20px; }
  @keyframes float-card { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-8px); } }
  .fc-icon { width: 36px; height: 36px; border-radius: 8px; background: var(--gold-dim); display: flex; align-items: center; justify-content: center; font-size: 16px; flex-shrink: 0; }
  .fc-label { font-size: 11px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; }
  .fc-value { font-size: 14px; font-weight: 600; color: var(--cream); }

  /* TRUST BAR */
  .trust-bar { border-top: 1px solid var(--border2); border-bottom: 1px solid var(--border2); padding: 24px 40px; background: var(--bg2); }
  .trust-inner { max-width: 1400px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 40px; flex-wrap: wrap; }
  .trust-item { display: flex; align-items: center; gap: 12px; }
  .trust-icon { font-size: 20px; }
  .trust-label { font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; }
  .trust-value { font-size: 15px; font-weight: 600; color: var(--cream2); }
  .trust-div { width: 1px; height: 36px; background: var(--border2); }
  .stars { color: #fbbf24; letter-spacing: 2px; }

  /* SECTION WRAPPER */
  .section { padding: 120px 40px; max-width: 1400px; margin: 0 auto; }
  .section-header { text-align: center; margin-bottom: 72px; }
  .eyebrow { display: inline-flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 600; letter-spacing: 0.2em; text-transform: uppercase; color: var(--gold); margin-bottom: 16px; }
  .eyebrow::before, .eyebrow::after { content: ''; display: inline-block; width: 24px; height: 1px; background: var(--gold); }
  .section-title { font-family: var(--font-display); font-size: clamp(36px, 4vw, 60px); font-weight: 400; line-height: 1.15; color: var(--cream); margin-bottom: 20px; }
  .section-title em { font-style: italic; color: var(--gold); }
  .section-sub { font-size: 16px; color: var(--muted2); max-width: 560px; margin: 0 auto; line-height: 1.75; }

  /* SERVICES */
  .services-bg { background: var(--bg2); padding: 120px 0; }
  .services-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1px; background: var(--border2); border: 1px solid var(--border2); border-radius: var(--radius2); overflow: hidden; }
  .service-card { background: var(--card); padding: 36px 28px; transition: all 0.4s ease; cursor: pointer; position: relative; overflow: hidden; }
  .service-card::before { content: ''; position: absolute; inset: 0; background: linear-gradient(135deg, var(--gold-dim), transparent); opacity: 0; transition: opacity 0.4s; }
  .service-card:hover { background: #16161f; }
  .service-card:hover::before { opacity: 1; }
  .service-card:hover .service-arrow { transform: translate(4px, -4px); opacity: 1; }
  .service-icon { font-size: 36px; margin-bottom: 20px; display: block; }
  .service-name { font-family: var(--font-display); font-size: 22px; font-weight: 500; color: var(--cream); margin-bottom: 10px; line-height: 1.2; }
  .service-desc { font-size: 13px; color: var(--muted); line-height: 1.7; margin-bottom: 20px; }
  .service-price { font-size: 12px; color: var(--gold); font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; }
  .service-arrow { position: absolute; top: 24px; right: 24px; font-size: 18px; color: var(--gold); opacity: 0; transition: all 0.3s; }

  /* BEFORE/AFTER */
  .before-after-container { position: relative; border-radius: 20px; overflow: hidden; cursor: col-resize; user-select: none; border: 1px solid var(--border); box-shadow: var(--shadow); }
  .ba-side { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 80px; }
  .ba-before { background: linear-gradient(135deg, #1a1a2e, #2d1b69, #1a1a3e); }
  .ba-after { background: linear-gradient(135deg, #0d2137, #1a4a6e, #0a3040); }
  .ba-label { position: absolute; bottom: 20px; background: rgba(0,0,0,0.7); backdrop-filter: blur(8px); padding: 6px 14px; border-radius: 100px; font-size: 11px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--cream); }
  .ba-divider { position: absolute; top: 0; bottom: 0; width: 2px; background: var(--gold); z-index: 10; }
  .ba-handle { position: absolute; top: 50%; width: 44px; height: 44px; background: var(--gold); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; color: var(--bg); font-weight: 700; box-shadow: 0 4px 24px rgba(201,169,110,0.5); transform: translate(-50%, -50%); }
  .ba-section { padding: 120px 40px; }
  .ba-grid { max-width: 1400px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
  .ba-cases { display: flex; flex-direction: column; gap: 12px; }
  .ba-case-btn { background: var(--card); border: 1px solid var(--border2); border-radius: 12px; padding: 16px 20px; display: flex; align-items: center; gap: 16px; cursor: pointer; transition: all 0.3s; text-align: left; }
  .ba-case-btn.active, .ba-case-btn:hover { border-color: var(--gold); background: var(--gold-dim); }
  .ba-case-dot { width: 10px; height: 10px; border-radius: 50%; background: var(--muted); flex-shrink: 0; transition: background 0.3s; }
  .ba-case-btn.active .ba-case-dot { background: var(--gold); }
  .ba-case-name { font-size: 14px; font-weight: 600; color: var(--cream); }
  .ba-case-sub { font-size: 12px; color: var(--muted); margin-top: 2px; }

  /* TECHNOLOGY */
  .tech-bg { background: linear-gradient(180deg, var(--bg2) 0%, var(--bg) 100%); padding: 120px 0; }
  .tech-grid { display: grid; grid-template-columns: 1fr 2fr; gap: 80px; align-items: start; }
  .tech-items { display: flex; flex-direction: column; gap: 2px; }
  .tech-item { padding: 24px 28px; border-radius: 12px; cursor: pointer; transition: all 0.3s; border: 1px solid transparent; }
  .tech-item.active, .tech-item:hover { background: var(--card); border-color: var(--border); }
  .tech-item.active .tech-item-name { color: var(--gold); }
  .tech-item-name { font-family: var(--font-display); font-size: 20px; font-weight: 500; color: var(--cream2); margin-bottom: 6px; transition: color 0.3s; }
  .tech-item-desc { font-size: 13px; color: var(--muted); line-height: 1.6; }
  .tech-display { background: var(--card); border: 1px solid var(--border); border-radius: 24px; padding: 48px; min-height: 460px; display: flex; flex-direction: column; justify-content: space-between; position: relative; overflow: hidden; }
  .tech-display::before { content: ''; position: absolute; top: -80px; right: -80px; width: 320px; height: 320px; background: radial-gradient(circle, var(--gold-dim) 0%, transparent 70%); border-radius: 50%; pointer-events: none; }
  .tech-display-icon { font-size: 80px; margin-bottom: 24px; }
  .tech-display-title { font-family: var(--font-display); font-size: 36px; font-weight: 400; color: var(--cream); margin-bottom: 16px; }
  .tech-display-body { font-size: 15px; color: var(--muted2); line-height: 1.75; }
  .tech-features { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 28px; }
  .tech-tag { padding: 6px 14px; border-radius: 100px; border: 1px solid var(--border); font-size: 12px; color: var(--gold); background: var(--gold-dim); font-weight: 500; }

  /* TEAM */
  .team-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .team-card { background: var(--card); border: 1px solid var(--border2); border-radius: 20px; overflow: hidden; transition: all 0.4s; cursor: pointer; position: relative; }
  .team-card:hover { transform: translateY(-8px); border-color: var(--border); box-shadow: var(--shadow); }
  .team-card:hover .team-overlay { opacity: 1; }
  .team-img { height: 340px; background: linear-gradient(135deg, #1a2a4a 0%, #0d1835 50%, #2a1a3a 100%); display: flex; align-items: center; justify-content: center; font-size: 80px; position: relative; overflow: hidden; }
  .team-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 30%, rgba(9,9,14,0.95) 100%); opacity: 0; transition: opacity 0.4s; display: flex; flex-direction: column; justify-content: flex-end; padding: 24px; }
  .team-overlay-links { display: flex; gap: 12px; }
  .team-link { width: 36px; height: 36px; border-radius: 8px; background: rgba(201,169,110,0.2); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 14px; text-decoration: none; color: var(--cream); transition: all 0.2s; }
  .team-link:hover { background: var(--gold); color: var(--bg); }
  .team-info { padding: 24px 24px 28px; }
  .team-name { font-family: var(--font-display); font-size: 24px; font-weight: 500; color: var(--cream); margin-bottom: 4px; }
  .team-role { font-size: 13px; color: var(--gold); font-weight: 500; margin-bottom: 12px; }
  .team-creds { display: flex; flex-wrap: wrap; gap: 6px; }
  .team-cred { padding: 4px 10px; border-radius: 100px; border: 1px solid var(--border2); font-size: 11px; color: var(--muted2); font-weight: 500; }

  /* PROCESS */
  .process-bg { background: var(--bg2); padding: 120px 0; }
  .process-steps { display: grid; grid-template-columns: repeat(5, 1fr); gap: 0; position: relative; }
  .process-steps::before { content: ''; position: absolute; top: 32px; left: 10%; right: 10%; height: 1px; background: linear-gradient(90deg, transparent, var(--gold), transparent); z-index: 0; }
  .process-step { text-align: center; padding: 0 16px; position: relative; z-index: 1; }
  .process-num { width: 64px; height: 64px; border-radius: 50%; background: var(--card); border: 2px solid var(--border); display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; font-family: var(--font-display); font-size: 22px; font-weight: 500; color: var(--gold); transition: all 0.3s; }
  .process-step:hover .process-num { background: var(--gold); color: var(--bg); border-color: var(--gold); box-shadow: 0 0 32px rgba(201,169,110,0.4); }
  .process-icon { font-size: 24px; margin-bottom: 12px; }
  .process-title { font-family: var(--font-display); font-size: 18px; font-weight: 500; color: var(--cream); margin-bottom: 8px; }
  .process-desc { font-size: 12px; color: var(--muted); line-height: 1.6; }

  /* TESTIMONIALS */
  .testimonials-bg { background: var(--bg); padding: 120px 0; overflow: hidden; }
  .testimonials-track { display: flex; gap: 24px; overflow-x: hidden; }
  .testimonial-card { background: var(--card); border: 1px solid var(--border2); border-radius: 20px; padding: 36px; min-width: 400px; max-width: 400px; transition: all 0.4s; flex-shrink: 0; }
  .testimonial-card:hover { border-color: var(--border); transform: translateY(-4px); }
  .test-stars { color: #fbbf24; font-size: 14px; letter-spacing: 2px; margin-bottom: 16px; }
  .test-quote { font-family: var(--font-display); font-size: 20px; font-style: italic; color: var(--cream2); line-height: 1.6; margin-bottom: 24px; }
  .test-author { display: flex; align-items: center; gap: 12px; }
  .test-avatar { width: 44px; height: 44px; border-radius: 50%; background: linear-gradient(135deg, var(--gold), #b8955a); display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: 700; color: var(--bg); flex-shrink: 0; }
  .test-name { font-size: 14px; font-weight: 600; color: var(--cream); }
  .test-meta { font-size: 12px; color: var(--muted); margin-top: 2px; }
  .test-verified { margin-left: auto; font-size: 11px; color: #4ade80; display: flex; align-items: center; gap: 4px; white-space: nowrap; }

  /* QUIZ */
  .quiz-bg { background: linear-gradient(135deg, var(--bg2) 0%, var(--bg) 100%); padding: 120px 0; }
  .quiz-container { max-width: 700px; margin: 0 auto; background: var(--card); border: 1px solid var(--border); border-radius: 24px; padding: 56px; text-align: center; }
  .quiz-progress { height: 3px; background: var(--border2); border-radius: 100px; margin-bottom: 48px; overflow: hidden; }
  .quiz-progress-fill { height: 100%; background: linear-gradient(90deg, var(--gold), var(--gold2)); border-radius: 100px; transition: width 0.5s ease; }
  .quiz-step-label { font-size: 11px; color: var(--muted); letter-spacing: 0.2em; text-transform: uppercase; margin-bottom: 12px; }
  .quiz-question { font-family: var(--font-display); font-size: 32px; font-weight: 400; color: var(--cream); line-height: 1.3; margin-bottom: 36px; }
  .quiz-options { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 32px; }
  .quiz-option { background: var(--bg); border: 1px solid var(--border2); border-radius: 12px; padding: 20px 16px; cursor: pointer; transition: all 0.3s; font-size: 14px; font-weight: 500; color: var(--cream2); display: flex; flex-direction: column; align-items: center; gap: 8px; }
  .quiz-option:hover, .quiz-option.selected { border-color: var(--gold); background: var(--gold-dim); color: var(--gold); }
  .quiz-option-icon { font-size: 28px; }
  .quiz-result { padding: 28px; background: var(--bg); border-radius: 16px; border: 1px solid var(--border); margin-bottom: 24px; }
  .quiz-result-title { font-family: var(--font-display); font-size: 28px; color: var(--gold); margin-bottom: 8px; }
  .quiz-result-desc { font-size: 14px; color: var(--muted2); line-height: 1.7; }

  /* FINANCING */
  .financing-bg { background: var(--bg2); padding: 120px 0; }
  .financing-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
  .financing-calc { background: var(--card); border: 1px solid var(--border); border-radius: 24px; padding: 48px; }
  .calc-label { font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px; display: block; }
  .calc-amount { font-family: var(--font-display); font-size: 60px; font-weight: 600; color: var(--cream); margin-bottom: 4px; line-height: 1; }
  .calc-slider { -webkit-appearance: none; appearance: none; width: 100%; height: 3px; border-radius: 100px; outline: none; margin: 20px 0 40px; cursor: pointer; }
  .calc-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 20px; height: 20px; border-radius: 50%; background: var(--gold); cursor: pointer; box-shadow: 0 2px 16px rgba(201,169,110,0.5); }
  .calc-terms { display: flex; gap: 10px; margin-bottom: 36px; }
  .calc-term { flex: 1; padding: 10px; border: 1px solid var(--border2); border-radius: 8px; text-align: center; cursor: pointer; font-size: 13px; font-weight: 500; color: var(--muted2); transition: all 0.3s; }
  .calc-term.active { border-color: var(--gold); color: var(--gold); background: var(--gold-dim); }
  .calc-result { background: linear-gradient(135deg, var(--gold-dim), transparent); border: 1px solid var(--border); border-radius: 16px; padding: 28px; display: flex; align-items: center; justify-content: space-between; }
  .calc-monthly-num { font-family: var(--font-display); font-size: 52px; font-weight: 600; color: var(--gold); line-height: 1; }
  .calc-monthly-label { font-size: 13px; color: var(--muted); margin-top: 4px; }
  .financing-perks { display: flex; flex-direction: column; gap: 24px; }
  .financing-perk { display: flex; gap: 20px; align-items: flex-start; }
  .fp-icon { width: 48px; height: 48px; border-radius: 12px; background: var(--gold-dim); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 20px; flex-shrink: 0; }
  .fp-title { font-size: 16px; font-weight: 600; color: var(--cream); margin-bottom: 4px; }
  .fp-desc { font-size: 13px; color: var(--muted); line-height: 1.6; }

  /* FAQ */
  .faq-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; }
  .faq-item { border-bottom: 1px solid var(--border2); padding-bottom: 24px; margin-bottom: 24px; }
  .faq-question { display: flex; align-items: center; justify-content: space-between; cursor: pointer; gap: 16px; }
  .faq-q-text { font-size: 16px; font-weight: 500; color: var(--cream2); line-height: 1.4; transition: color 0.2s; }
  .faq-question:hover .faq-q-text { color: var(--gold); }
  .faq-toggle { width: 28px; height: 28px; border-radius: 50%; border: 1px solid var(--border2); background: var(--card); display: flex; align-items: center; justify-content: center; font-size: 16px; color: var(--muted2); flex-shrink: 0; transition: all 0.3s; }
  .faq-item.open .faq-toggle { background: var(--gold-dim); border-color: var(--border); color: var(--gold); transform: rotate(45deg); }
  .faq-answer { font-size: 14px; color: var(--muted); line-height: 1.75; overflow: hidden; max-height: 0; transition: max-height 0.4s ease, margin-top 0.3s; }
  .faq-item.open .faq-answer { max-height: 200px; margin-top: 14px; }

  /* BOOKING */
  .booking-bg { background: linear-gradient(135deg, var(--bg2) 0%, #0d1a35 50%, var(--bg2) 100%); padding: 120px 0; position: relative; overflow: hidden; }
  .booking-bg::before { content: ''; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 800px; height: 800px; background: radial-gradient(circle, rgba(26,58,110,0.2) 0%, transparent 70%); border-radius: 50%; pointer-events: none; }
  .booking-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 80px; align-items: start; }
  .booking-info h2 { font-family: var(--font-display); font-size: 52px; font-weight: 400; line-height: 1.1; color: var(--cream); margin-bottom: 20px; }
  .booking-info p { font-size: 16px; color: var(--muted2); line-height: 1.75; margin-bottom: 40px; }
  .contact-item { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; }
  .contact-icon { width: 44px; height: 44px; border-radius: 10px; background: var(--gold-dim); border: 1px solid var(--border); display: flex; align-items: center; justify-content: center; font-size: 18px; }
  .contact-val { font-size: 15px; color: var(--cream2); }
  .contact-lbl { font-size: 12px; color: var(--muted); }
  .booking-form { background: var(--card); border: 1px solid var(--border); border-radius: 24px; padding: 48px; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 0; }
  .form-group { margin-bottom: 16px; }
  .form-group label { display: block; font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted2); margin-bottom: 8px; }
  .form-group input, .form-group select, .form-group textarea { width: 100%; background: var(--bg); border: 1px solid var(--border2); border-radius: 8px; padding: 14px 16px; font-size: 14px; color: var(--cream); font-family: var(--font-body); outline: none; transition: border-color 0.2s; }
  .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: var(--gold); }
  .form-group select { cursor: pointer; appearance: none; }
  .form-group textarea { resize: vertical; min-height: 100px; }
  .form-group input::placeholder, .form-group textarea::placeholder { color: var(--muted); }
  .form-group select option { background: var(--bg2); }

  /* AWARDS */
  .awards-bg { background: var(--bg); padding: 80px 0; border-top: 1px solid var(--border2); }
  .awards-row { display: flex; align-items: center; justify-content: center; gap: 60px; flex-wrap: wrap; }
  .award-item { text-align: center; opacity: 0.6; transition: opacity 0.3s; }
  .award-item:hover { opacity: 1; }
  .award-icon { font-size: 36px; margin-bottom: 8px; }
  .award-name { font-size: 11px; color: var(--muted2); text-transform: uppercase; letter-spacing: 0.1em; }
  .award-year { font-size: 13px; color: var(--gold); font-weight: 600; }

  /* BLOG */
  .blog-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .blog-card { background: var(--card); border: 1px solid var(--border2); border-radius: 16px; overflow: hidden; cursor: pointer; transition: all 0.4s; }
  .blog-card:hover { transform: translateY(-6px); border-color: var(--border); }
  .blog-img { height: 200px; background: linear-gradient(135deg, #1a2a4a, #0a1a30); display: flex; align-items: center; justify-content: center; font-size: 48px; position: relative; overflow: hidden; }
  .blog-category { position: absolute; top: 16px; left: 16px; background: var(--gold-dim); border: 1px solid var(--border); border-radius: 100px; padding: 4px 12px; font-size: 10px; font-weight: 700; color: var(--gold); letter-spacing: 0.1em; text-transform: uppercase; }
  .blog-content { padding: 24px; }
  .blog-title { font-family: var(--font-display); font-size: 20px; font-weight: 500; color: var(--cream); line-height: 1.3; margin-bottom: 10px; }
  .blog-excerpt { font-size: 13px; color: var(--muted); line-height: 1.7; margin-bottom: 20px; }
  .blog-meta { display: flex; align-items: center; justify-content: space-between; }
  .blog-author { font-size: 12px; color: var(--muted2); }
  .blog-read { font-size: 12px; color: var(--gold); font-weight: 600; }

  /* LOCATION */
  .location-bg { background: var(--bg2); padding: 80px 40px; }
  .location-inner { max-width: 1400px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }
  .location-map { height: 360px; background: var(--card); border: 1px solid var(--border); border-radius: 20px; display: flex; align-items: center; justify-content: center; overflow: hidden; position: relative; }
  .location-map-overlay { position: absolute; inset: 0; background: linear-gradient(135deg, rgba(26,58,110,0.3), rgba(9,9,14,0.6)); display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px; }
  .hours-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-top: 8px; }
  .hours-item { background: var(--card); border: 1px solid var(--border2); border-radius: 8px; padding: 12px 16px; }
  .hours-day { font-size: 12px; color: var(--muted); text-transform: uppercase; letter-spacing: 0.08em; }
  .hours-time { font-size: 14px; font-weight: 600; color: var(--cream2); margin-top: 4px; }

  /* FOOTER */
  .footer { background: #060609; border-top: 1px solid var(--border2); padding: 80px 40px 40px; }
  .footer-inner { max-width: 1400px; margin: 0 auto; }
  .footer-top { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 60px; padding-bottom: 60px; border-bottom: 1px solid var(--border2); margin-bottom: 40px; }
  .footer-logo { font-family: var(--font-display); font-size: 26px; font-weight: 600; color: var(--cream); margin-bottom: 16px; display: flex; align-items: center; gap: 10px; }
  .footer-tagline { font-size: 14px; color: var(--muted); line-height: 1.7; max-width: 280px; margin-bottom: 28px; }
  .footer-social { display: flex; gap: 10px; }
  .social-btn { width: 36px; height: 36px; border-radius: 8px; background: var(--card); border: 1px solid var(--border2); display: flex; align-items: center; justify-content: center; font-size: 14px; cursor: pointer; transition: all 0.2s; color: var(--muted2); }
  .social-btn:hover { background: var(--gold-dim); border-color: var(--border); color: var(--gold); }
  .footer-col-title { font-size: 12px; font-weight: 700; letter-spacing: 0.15em; text-transform: uppercase; color: var(--cream2); margin-bottom: 20px; }
  .footer-links { list-style: none; }
  .footer-links li { margin-bottom: 12px; }
  .footer-links a { font-size: 14px; color: var(--muted); text-decoration: none; transition: color 0.2s; }
  .footer-links a:hover { color: var(--gold); }
  .footer-bottom { display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: var(--muted); flex-wrap: wrap; gap: 12px; }
  .footer-bottom-links { display: flex; gap: 24px; }
  .footer-bottom-links a { color: var(--muted); text-decoration: none; }
  .footer-bottom-links a:hover { color: var(--gold); }

  /* FLOATING WIDGETS */
  .float-ctas { position: fixed; bottom: 32px; right: 32px; z-index: 800; display: flex; flex-direction: column; gap: 12px; align-items: flex-end; }
  .float-btn { display: flex; align-items: center; gap: 10px; background: var(--card); border: 1px solid var(--border); border-radius: 100px; padding: 12px 20px; font-size: 13px; font-weight: 600; color: var(--cream); cursor: pointer; transition: all 0.3s; backdrop-filter: blur(20px); box-shadow: 0 8px 32px rgba(0,0,0,0.5); white-space: nowrap; }
  .float-btn:hover { transform: translateX(-4px); border-color: var(--gold); color: var(--gold); }
  .float-btn.primary { background: linear-gradient(135deg, var(--gold), #b8955a); color: var(--bg); border-color: transparent; }
  .float-btn.primary:hover { box-shadow: 0 8px 32px rgba(201,169,110,0.4); transform: translateX(-4px); }

  /* COOKIE */
  .cookie-banner { position: fixed; bottom: 24px; left: 24px; max-width: 520px; z-index: 950; background: var(--card); border: 1px solid var(--border); border-radius: 16px; padding: 24px 28px; box-shadow: var(--shadow); }
  .cookie-title { font-size: 15px; font-weight: 600; color: var(--cream); margin-bottom: 8px; }
  .cookie-text { font-size: 13px; color: var(--muted); line-height: 1.6; margin-bottom: 20px; }
  .cookie-btns { display: flex; gap: 10px; }
  .btn-cookie-accept { background: var(--gold); color: var(--bg); padding: 10px 20px; border-radius: 8px; border: none; font-size: 13px; font-weight: 600; cursor: pointer; }
  .btn-cookie-decline { background: transparent; color: var(--muted2); padding: 10px 20px; border-radius: 8px; border: 1px solid var(--border2); font-size: 13px; font-weight: 500; cursor: pointer; }

  /* CHAT */
  .chat-bubble { position: fixed; bottom: 32px; left: 32px; z-index: 800; background: linear-gradient(135deg, var(--blue2), var(--blue)); width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 22px; cursor: pointer; box-shadow: 0 8px 32px rgba(36,82,168,0.5); transition: all 0.3s; border: none; }
  .chat-bubble:hover { transform: scale(1.1); }
  .chat-dot { position: absolute; top: 2px; right: 2px; width: 14px; height: 14px; background: #4ade80; border-radius: 50%; border: 2px solid var(--bg); animation: pulse-anim 2s infinite; }

  /* NOTIFICATION */
  .notification { position: fixed; top: 100px; right: 24px; z-index: 850; background: var(--card); border: 1px solid var(--border); border-radius: 12px; padding: 16px 20px; display: flex; align-items: center; gap: 12px; max-width: 320px; box-shadow: var(--shadow); animation: slide-in 0.5s ease; }
  @keyframes slide-in { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
  .notif-icon { font-size: 20px; }
  .notif-title { font-size: 13px; font-weight: 600; color: var(--cream); }
  .notif-sub { font-size: 12px; color: var(--muted); margin-top: 2px; }

  /* SCROLL */
  .scroll-ind { display: flex; flex-direction: column; align-items: center; gap: 8px; position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%); font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; color: var(--muted); animation: bounce 2s ease-in-out infinite; }
  @keyframes bounce { 0%,100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(8px); } }
  .scroll-line { width: 1px; height: 40px; background: linear-gradient(180deg, transparent, var(--gold)); }

  /* FADE UP */
  .fade-up { opacity: 0; transform: translateY(30px); transition: all 0.7s ease; }
  .fade-up.visible { opacity: 1; transform: translateY(0); }

  /* MOBILE */
  @media (max-width: 1100px) {
    .hero-content { grid-template-columns: 1fr; }
    .hero-visual { display: none; }
    .services-grid { grid-template-columns: repeat(2, 1fr); }
    .team-grid { grid-template-columns: 1fr 1fr; }
    .process-steps { grid-template-columns: repeat(3, 1fr); }
    .process-steps::before { display: none; }
    .tech-grid { grid-template-columns: 1fr; }
    .faq-grid { grid-template-columns: 1fr; }
    .footer-top { grid-template-columns: 1fr 1fr; }
  }
  @media (max-width: 768px) {
    .nav-links, .btn-book-nav { display: none; }
    .mobile-menu-btn { display: flex; }
    .hero { padding: 100px 24px 60px; }
    .section { padding: 80px 24px; }
    .services-grid { grid-template-columns: 1fr; }
    .ba-grid { grid-template-columns: 1fr; }
    .financing-grid { grid-template-columns: 1fr; }
    .booking-grid { grid-template-columns: 1fr; }
    .blog-grid { grid-template-columns: 1fr; }
    .team-grid { grid-template-columns: 1fr; }
    .process-steps { grid-template-columns: 1fr 1fr; }
    .hero-stats { gap: 28px; }
    .form-row { grid-template-columns: 1fr; }
    .footer-top { grid-template-columns: 1fr; }
    .quiz-options { grid-template-columns: 1fr; }
    .float-ctas { bottom: 16px; right: 16px; }
    .cookie-banner { left: 12px; right: 12px; bottom: 12px; }
    .location-inner { grid-template-columns: 1fr; }
    .trust-inner { gap: 20px; }
    .trust-div { display: none; }
    .nav { padding: 0 20px; }
    .emergency-banner { padding: 10px 16px; font-size: 12px; }
    .chat-bubble { bottom: 16px; left: 16px; }
  }
`;

const SERVICES = [
  { icon: "✨", name: "Porcelain Veneers", desc: "Ultra-thin, custom-crafted shells that transform your smile instantly. Hollywood-quality results guaranteed.", price: "From $1,200/tooth" },
  { icon: "🦷", name: "Dental Implants", desc: "Permanent, titanium-rooted replacements that look, feel, and function exactly like natural teeth.", price: "From $3,500/implant" },
  { icon: "🔲", name: "Invisalign® Elite", desc: "Clear aligner therapy by certified Invisalign Diamond providers. Discreet, comfortable, precise.", price: "From $4,800" },
  { icon: "⚡", name: "Teeth Whitening", desc: "Professional-grade Zoom! whitening with up to 8 shades lighter in a single 60-minute session.", price: "From $650" },
  { icon: "👑", name: "Full Mouth Restoration", desc: "Comprehensive reconstruction combining implants, crowns, and veneers for a complete smile makeover.", price: "Custom quote" },
  { icon: "🛡️", name: "Ceramic Crowns", desc: "Same-day CEREC crowns with perfect fit and natural aesthetics, milled in our on-site lab.", price: "From $1,400" },
  { icon: "🌙", name: "Sleep Apnea & TMJ", desc: "Custom oral appliances for sleep apnea and TMJ disorder. Wake up refreshed, live pain-free.", price: "From $1,800" },
  { icon: "🧬", name: "Periodontal Care", desc: "Advanced gum disease treatment with laser therapy for minimal discomfort and faster recovery.", price: "From $400" },
];

const TECHS = [
  { name: "3D CBCT Imaging", icon: "🔬", desc: "Our cone beam CT scanner produces ultra-detailed 3D images of your jaw, teeth, and bone structure — enabling implant planning with sub-millimeter precision.", tags: ["Sub-0.1mm accuracy", "Instant results", "Low radiation"] },
  { name: "iTero Digital Scanner", icon: "📡", desc: "No more uncomfortable impressions. Our iTero Element scanner creates a perfect 3D digital model of your mouth in seconds, with Invisalign Outcome Simulator included.", tags: ["Zero discomfort", "60-second scan", "Invisalign integrated"] },
  { name: "CEREC Same-Day Crowns", icon: "⚙️", desc: "Our in-house CEREC milling machine designs and creates precision ceramic restorations in under 2 hours — beautiful, durable crowns with zero wait time.", tags: ["2-hour turnaround", "CAD/CAM precision", "Premium ceramic"] },
  { name: "Laser Dentistry", icon: "💡", desc: "Waterlase® laser technology for cavity prep, gum contouring, and periodontal treatment. Dramatically reduced pain, bleeding, and recovery time.", tags: ["Near-painless", "Faster healing", "No drill needed"] },
  { name: "Zoom! Whitening System", icon: "✨", desc: "Philips Zoom WhiteSpeed system activates professional whitening gel with LED light, achieving up to 8 shades lighter in a single 60-minute in-office session.", tags: ["8 shades lighter", "60 minutes", "Long-lasting"] },
];

const DOCTORS = [
  { name: "Dr. Alexandra Reeves", role: "Lead Cosmetic Dentist & Founder", emoji: "👩‍⚕️", creds: ["DDS Harvard", "AACD Fellow", "Invisalign Diamond"] },
  { name: "Dr. Marcus Chen", role: "Oral Surgeon & Implantologist", emoji: "👨‍⚕️", creds: ["DMD Columbia", "Board Certified", "OMS Specialist"] },
  { name: "Dr. Sophia Patel", role: "Orthodontist & Aligner Specialist", emoji: "👩‍⚕️", creds: ["DMD UPenn", "AAO Member", "Invisalign Elite"] },
];

const TESTIMONIALS = [
  { stars: 5, quote: "I spent years hiding my smile. After my veneers with Dr. Reeves, I genuinely cannot stop smiling. Best investment I've ever made in myself.", name: "Jessica M.", meta: "Porcelain Veneers · 2 months ago" },
  { stars: 5, quote: "The technology here is unlike anything I've experienced. My implant consultation used 3D imaging I didn't know existed. Procedure was flawless.", name: "Robert T.", meta: "Dental Implants · 4 months ago" },
  { stars: 5, quote: "I'd been told by three other practices that Invisalign wouldn't work for me. Dr. Patel proved them all wrong. 11 months later — I'm obsessed.", name: "Amanda K.", meta: "Invisalign · 6 months ago" },
  { stars: 5, quote: "As someone with severe dental anxiety, I was dreading every appointment. The team here completely changed that. Sedation dentistry was a game-changer.", name: "Michael R.", meta: "Full Mouth Restoration · 8 months ago" },
  { stars: 5, quote: "My CEREC crown was done in 2 hours. Two hours! I came in on my lunch break and left with a permanent crown. Mind-blowing.", name: "Sarah L.", meta: "Same-Day Crown · 3 months ago" },
  { stars: 5, quote: "Flew from Dallas specifically for this practice. Worth every penny of the flight, hotel, and treatment. Simply the best cosmetic dentistry in the country.", name: "David H.", meta: "Smile Makeover · 1 month ago" },
];

const FAQS = [
  { q: "How long do porcelain veneers last?", a: "With proper care, high-quality porcelain veneers can last 15–25 years. We use only premium E.max ceramic, which is the gold standard in cosmetic dentistry." },
  { q: "Am I a candidate for dental implants?", a: "Most adults with good general health qualify. We use 3D CBCT imaging to assess bone density precisely. Even patients with some bone loss may qualify with grafting." },
  { q: "Does Invisalign work for severe cases?", a: "Modern Invisalign handles 90% of orthodontic cases including severe crowding, gaps, and bite issues. Dr. Patel's Diamond status means we take on complex cases others decline." },
  { q: "What sedation options do you offer?", a: "We offer nitrous oxide, oral conscious sedation, and IV sedation administered by a board-certified anesthesiologist. Your comfort is our non-negotiable priority." },
  { q: "Do you accept dental insurance?", a: "Yes, we're in-network with most major PPO plans. For cosmetic work, we offer CareCredit, Alphaeon, and our own 0% in-house financing for up to 24 months." },
  { q: "How long does a smile makeover take?", a: "Simple veneer cases: 2–3 appointments over 3 weeks. Comprehensive full-mouth restorations: 3–6 months. We create a custom timeline at your complimentary consultation." },
];

const BA_CASES = [
  { name: "Complete Smile Makeover", sub: "8 porcelain veneers · 3 weeks" },
  { name: "Invisalign Transformation", sub: "18 months · no extractions" },
  { name: "Full Implant Bridge", sub: "All-on-4 · same-day teeth" },
  { name: "Gum Contouring + Whitening", sub: "Laser treatment · 1 session" },
];

const BLOG_POSTS = [
  { icon: "✨", cat: "Cosmetic", title: "The Truth About Porcelain Veneers: What No One Tells You", excerpt: "After placing over 2,000 veneer cases, here's what our lead cosmetic dentist wishes every patient knew before their consultation.", author: "Dr. Alexandra Reeves", readTime: "5 min read" },
  { icon: "🦷", cat: "Implants", title: "All-on-4 vs Traditional Implants: A Surgeon's Honest Guide", excerpt: "The marketing makes it confusing. Dr. Chen breaks down exactly who each option is right for, without the upsell.", author: "Dr. Marcus Chen", readTime: "7 min read" },
  { icon: "🔲", cat: "Orthodontics", title: "Why Your Invisalign Results Depend 90% on Your Doctor", excerpt: "The aligner technology is secondary. The treatment plan, refinements, and expertise behind it are everything.", author: "Dr. Sophia Patel", readTime: "4 min read" },
];

const QUIZ_STEPS = [
  { question: "What's your biggest smile concern?", options: [{ icon: "🎨", label: "Color & Staining" }, { icon: "📐", label: "Shape & Size" }, { icon: "🔧", label: "Missing Teeth" }, { icon: "〰️", label: "Crowding or Gaps" }] },
  { question: "How important is keeping treatment discreet?", options: [{ icon: "🙈", label: "Very — invisible only" }, { icon: "😐", label: "Somewhat important" }, { icon: "💬", label: "Happy to explain it" }, { icon: "🚀", label: "Speed is priority" }] },
  { question: "What's your ideal timeline?", options: [{ icon: "⚡", label: "Same day / 1 visit" }, { icon: "📅", label: "Within 1 month" }, { icon: "🗓️", label: "3–6 months" }, { icon: "🌱", label: "I'm flexible" }] },
];

const QUIZ_RESULTS = [
  { title: "Porcelain Veneers", desc: "Based on your answers, custom porcelain veneers would deliver the dramatic, instant transformation you're looking for with results that last 20+ years." },
  { title: "Invisalign® Clear Aligners", desc: "Your profile is a perfect match for Invisalign. Discreet, comfortable treatment that corrects alignment without anyone knowing." },
  { title: "Professional Whitening + Veneers", desc: "A combination approach — professional whitening plus targeted veneers — would give you the most comprehensive, natural-looking transformation." },
  { title: "Full Smile Makeover", desc: "Your goals call for a custom treatment plan combining multiple modalities. A complimentary consultation will map out the exact roadmap." },
];

function Counter({ target, suffix = "" }) {
  const [val, setVal] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        let start = 0;
        const step = target / 60;
        const t = setInterval(() => {
          start = Math.min(start + step, target);
          setVal(Math.floor(start));
          if (start >= target) clearInterval(t);
        }, 16);
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>;
}

function BeforeAfterSlider() {
  const [pos, setPos] = useState(50);
  const ref = useRef(null);
  const dragging = useRef(false);
  const move = useCallback((clientX) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const p = Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100));
    setPos(p);
  }, []);
  return (
    <div ref={ref} className="before-after-container" style={{ height: 480 }}
      onMouseDown={() => { dragging.current = true; }}
      onMouseUp={() => { dragging.current = false; }}
      onMouseLeave={() => { dragging.current = false; }}
      onMouseMove={e => { if (dragging.current) move(e.clientX); }}
      onTouchMove={e => move(e.touches[0].clientX)}
    >
      <div className="ba-before ba-side">
        <span style={{ fontSize: 120, opacity: 0.3 }}>😬</span>
        <div className="ba-label" style={{ left: 20 }}>BEFORE</div>
      </div>
      <div className="ba-after ba-side" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        <span style={{ fontSize: 120, opacity: 0.4 }}>😁</span>
        <div className="ba-label" style={{ right: 20, color: "#c9a96e" }}>AFTER</div>
      </div>
      <div className="ba-divider" style={{ left: `${pos}%` }}>
        <div className="ba-handle">↔</div>
      </div>
    </div>
  );
}

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [cookie, setCookie] = useState(true);
  const [activeTech, setActiveTech] = useState(0);
  const [activeBA, setActiveBA] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [quizStep, setQuizStep] = useState(0);
  const [quizAnswers, setQuizAnswers] = useState([]);
  const [quizDone, setQuizDone] = useState(false);
  const [treatAmount, setTreatAmount] = useState(8000);
  const [activeTerm, setActiveTerm] = useState(24);
  const [notification, setNotification] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", service: "", date: "", time: "", msg: "" });
  const [formSuccess, setFormSuccess] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); });
    }, { threshold: 0.12 });
    const els = document.querySelectorAll(".fade-up");
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (notification) {
      const t = setTimeout(() => setNotification(false), 6000);
      return () => clearTimeout(t);
    }
  }, [notification]);

  const monthlyPayment = (treatAmount / activeTerm).toFixed(0);
  const quizResult = QUIZ_RESULTS[quizAnswers[0] ?? 0];

  const handleQuizAnswer = (idx) => {
    const newAnswers = [...quizAnswers, idx];
    setQuizAnswers(newAnswers);
    if (quizStep < QUIZ_STEPS.length - 1) setQuizStep(quizStep + 1);
    else setQuizDone(true);
  };

  const scrollToBook = () => document.getElementById("book").scrollIntoView({ behavior: "smooth" });

  const testRef = useRef(null);
  useEffect(() => {
    const el = testRef.current;
    if (!el) return;
    let x = 0;
    const anim = () => { x += 0.4; if (x >= el.scrollWidth / 2) x = 0; el.scrollLeft = x; };
    const id = setInterval(anim, 16);
    return () => clearInterval(id);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <style>{STYLES}</style>
      <div className="grain" />

      {notification && (
        <div className="notification">
          <div className="notif-icon">🏆</div>
          <div>
            <div className="notif-title">Best Dental Practice 2025</div>
            <div className="notif-sub">Voted #1 in New York by NY Magazine</div>
          </div>
        </div>
      )}

      {/* EMERGENCY */}
      <div className="emergency-banner">
        <div className="pulse" />
        <span>Dental Emergency? We see you <strong>same day</strong> —&nbsp;</span>
        <a href="tel:+12125551234">📞 Call (212) 555-1234</a>
        <span style={{ color: "rgba(255,255,255,0.4)" }}> | </span>
        <span style={{ color: "#ffd4d4" }}>Available 7 days · 8AM–8PM</span>
      </div>

      {/* NAV */}
      <nav className={`nav ${scrolled ? "scrolled" : ""}`}>
        <div className="nav-inner">
          <a href="#" className="nav-logo">
            <div className="logo-mark">A</div>
            ARCADIA DENTAL
          </a>
          <ul className="nav-links">
            {["Services", "Technology", "Team", "Results", "Financing", "Blog"].map(l => (
              <li key={l}><a href={`#${l.toLowerCase()}`}>{l}</a></li>
            ))}
          </ul>
          <button className="btn-book-nav" onClick={scrollToBook}>Book Consultation →</button>
          <button className="mobile-menu-btn">☰</button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-bg" />
        <div className="hero-grid" />
        <div className="hero-content">
          <div>
            <div className="hero-eyebrow"><span>✦</span> New York's #1 Cosmetic Dentistry Practice</div>
            <h1 className="hero-title">Your Dream Smile.<br /><em>Finally Realized.</em></h1>
            <p className="hero-subtitle">Where precision science meets artistic vision. World-class cosmetic and restorative dentistry using the most advanced technology available — all under one roof in Midtown Manhattan.</p>
            <div className="hero-ctas">
              <button className="btn-primary" onClick={scrollToBook}>Book Free Consultation <span>→</span></button>
              <button className="btn-secondary" onClick={() => document.getElementById("results").scrollIntoView({ behavior: "smooth" })}>▶ View Results</button>
            </div>
            <div className="hero-stats">
              {[{ val: 4800, suf: "+", label: "Smiles Transformed" }, { val: 98, suf: "%", label: "Patient Satisfaction" }, { val: 22, suf: "yr", label: "Combined Expertise" }].map(s => (
                <div key={s.label}>
                  <div className="hero-stat-num"><Counter target={s.val} suffix={s.suf} /></div>
                  <div className="hero-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hero-visual">
            <div className="hero-floating-cards">
              <div className="floating-card"><div className="fc-icon">✦</div><div><div className="fc-label">Next available</div><div className="fc-value">Tomorrow, 10AM</div></div></div>
              <div className="floating-card"><div className="fc-icon">⭐</div><div><div className="fc-label">Google Rating</div><div className="fc-value">4.9 · 847 reviews</div></div></div>
            </div>
            <div className="hero-card-main">
              <div className="hero-card-img"><span className="smile-icon-hero">🦷</span></div>
              <div className="hero-card-badge">✦ Invisalign® Diamond Provider</div>
              <div style={{ padding: "24px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div><div style={{ fontSize: 13, color: "var(--muted)", marginBottom: 4 }}>Most popular this month</div><div style={{ fontSize: 17, fontWeight: 600, color: "var(--cream)", fontFamily: "var(--font-display)" }}>Porcelain Veneers Package</div></div>
                <div style={{ textAlign: "right" }}><div style={{ fontSize: 13, color: "var(--muted)", textDecoration: "line-through" }}>$9,600</div><div style={{ fontSize: 20, fontWeight: 700, color: "var(--gold)", fontFamily: "var(--font-display)" }}>$7,200</div></div>
              </div>
            </div>
          </div>
        </div>
        <div className="scroll-ind"><div className="scroll-line" /><span>Scroll</span></div>
      </section>

      {/* TRUST BAR */}
      <div className="trust-bar">
        <div className="trust-inner">
          {[
            { icon: "⭐", label: "Google Reviews", value: "4.9 / 5.0 · 847 Reviews" },
            { icon: "🏆", label: "Best Practice 2025", value: "NY Magazine" },
            { icon: "💎", label: "Invisalign Status", value: "Diamond Provider" },
            { icon: "🎓", label: "AACD Accredited", value: "Fellow Members" },
            { icon: "📍", label: "Location", value: "245 Park Ave, NYC" },
          ].map((t, i) => (
            <div key={i} style={{ display: "contents" }}>
              {i > 0 && <div className="trust-div" />}
              <div className="trust-item">
                <div className="trust-icon">{t.icon}</div>
                <div><div className="trust-label">{t.label}</div><div className="trust-value">{t.value}</div></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SERVICES */}
      <div className="services-bg" id="services">
        <div className="section">
          <div className="section-header fade-up">
            <div className="eyebrow">Our Services</div>
            <h2 className="section-title">Every Treatment. <em>One Practice.</em></h2>
            <p className="section-sub">From a simple whitening to a complete smile reconstruction — everything delivered with the same obsessive attention to quality and aesthetics.</p>
          </div>
          <div className="services-grid fade-up">
            {SERVICES.map((s, i) => (
              <div key={i} className="service-card">
                <div className="service-arrow">↗</div>
                <span className="service-icon">{s.icon}</span>
                <div className="service-name">{s.name}</div>
                <div className="service-desc">{s.desc}</div>
                <div className="service-price">{s.price}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BEFORE/AFTER */}
      <div className="ba-section" id="results" style={{ background: "var(--bg)" }}>
        <div style={{ maxWidth: 1400, margin: "0 auto" }}>
          <div className="section-header fade-up">
            <div className="eyebrow">Real Results</div>
            <h2 className="section-title">See the <em>Transformation</em></h2>
            <p className="section-sub">Real patients, real results. Every case in our gallery was treated at our practice by our own doctors.</p>
          </div>
          <div className="ba-grid fade-up">
            <div>
              <BeforeAfterSlider />
              <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 12, textAlign: "center" }}>← Drag to reveal transformation</p>
            </div>
            <div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 400, color: "var(--cream)", marginBottom: 8 }}>Browse Our Case Gallery</h3>
              <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7, marginBottom: 28 }}>Select a case type to see real patient transformations. All photos are unretouched and taken in-office.</p>
              <div className="ba-cases">
                {BA_CASES.map((c, i) => (
                  <div key={i} className={`ba-case-btn ${activeBA === i ? "active" : ""}`} onClick={() => setActiveBA(i)}>
                    <div className="ba-case-dot" /><div><div className="ba-case-name">{c.name}</div><div className="ba-case-sub">{c.sub}</div></div>
                  </div>
                ))}
              </div>
              <button className="btn-primary" style={{ marginTop: 32 }} onClick={scrollToBook}>Get My Free Assessment →</button>
            </div>
          </div>
        </div>
      </div>

      {/* TECHNOLOGY */}
      <div className="tech-bg" id="technology">
        <div className="section">
          <div className="section-header fade-up">
            <div className="eyebrow">Our Technology</div>
            <h2 className="section-title">Precision Tools for <em>Perfect Results</em></h2>
            <p className="section-sub">We've invested over $2.4M in the most advanced dental technology available — because your results depend on it.</p>
          </div>
          <div className="tech-grid fade-up">
            <div className="tech-items">
              {TECHS.map((t, i) => (
                <div key={i} className={`tech-item ${activeTech === i ? "active" : ""}`} onClick={() => setActiveTech(i)}>
                  <div className="tech-item-name">{t.name}</div>
                  <div className="tech-item-desc">{t.desc.substring(0, 60)}...</div>
                </div>
              ))}
            </div>
            <div className="tech-display">
              <div>
                <div className="tech-display-icon">{TECHS[activeTech].icon}</div>
                <div className="tech-display-title">{TECHS[activeTech].name}</div>
                <div className="tech-display-body">{TECHS[activeTech].desc}</div>
                <div className="tech-features">{TECHS[activeTech].tags.map(t => <span key={t} className="tech-tag">{t}</span>)}</div>
              </div>
              <button className="btn-secondary" style={{ marginTop: 32, alignSelf: "flex-start" }}>Learn More →</button>
            </div>
          </div>
        </div>
      </div>

      {/* TEAM */}
      <div style={{ padding: "120px 0", background: "var(--bg2)" }} id="team">
        <div className="section" style={{ padding: "0 40px" }}>
          <div className="section-header fade-up">
            <div className="eyebrow">Meet Your Doctors</div>
            <h2 className="section-title">World-Class Expertise, <em>Personal Care</em></h2>
            <p className="section-sub">Our doctors trained at America's top institutions and have collectively placed thousands of restorations.</p>
          </div>
          <div className="team-grid fade-up">
            {DOCTORS.map((d, i) => (
              <div key={i} className="team-card">
                <div className="team-img">
                  <span style={{ fontSize: 100, opacity: 0.5 }}>{d.emoji}</span>
                  <div className="team-overlay"><div className="team-overlay-links"><a className="team-link" href="#">🎓</a><a className="team-link" href="#">💼</a><a className="team-link" href="#">📧</a></div></div>
                </div>
                <div className="team-info">
                  <div className="team-name">{d.name}</div>
                  <div className="team-role">{d.role}</div>
                  <div className="team-creds">{d.creds.map(c => <span key={c} className="team-cred">{c}</span>)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PROCESS */}
      <div className="process-bg">
        <div className="section">
          <div className="section-header fade-up">
            <div className="eyebrow">How It Works</div>
            <h2 className="section-title">Your Journey to a <em>New Smile</em></h2>
          </div>
          <div className="process-steps fade-up">
            {[
              { n: "01", icon: "📋", title: "Free Consultation", desc: "30-minute comprehensive exam including digital X-rays and 3D scans — completely complimentary." },
              { n: "02", icon: "🎨", title: "Digital Smile Design", desc: "Preview your future smile before we begin using our DSD software and iTero simulation." },
              { n: "03", icon: "📐", title: "Custom Treatment Plan", desc: "Receive a personalized roadmap with exact timelines, pricing, and financing options." },
              { n: "04", icon: "⚙️", title: "Expert Treatment", desc: "Your procedure is performed with precision, comfort, and artistry by your dedicated doctor." },
              { n: "05", icon: "✨", title: "Lifetime Support", desc: "Complimentary 5-year maintenance plan, whitening refills, and dedicated concierge support." },
            ].map((s, i) => (
              <div key={i} className="process-step">
                <div className="process-num">{s.n}</div>
                <div className="process-icon">{s.icon}</div>
                <div className="process-title">{s.title}</div>
                <div className="process-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div className="testimonials-bg">
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 40px 72px" }}>
          <div className="section-header fade-up" style={{ marginBottom: 56 }}>
            <div className="eyebrow">Patient Stories</div>
            <h2 className="section-title">Don't Take Our Word For It</h2>
            <p className="section-sub"><span className="stars">★★★★★</span>&nbsp; 4.9 average across 847 verified Google reviews</p>
          </div>
        </div>
        <div ref={testRef} className="testimonials-track" style={{ paddingLeft: 40, paddingBottom: 12 }}>
          {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
            <div key={i} className="testimonial-card">
              <div className="test-stars">{"★".repeat(t.stars)}</div>
              <div className="test-quote">"{t.quote}"</div>
              <div className="test-author">
                <div className="test-avatar">{t.name[0]}</div>
                <div><div className="test-name">{t.name}</div><div className="test-meta">{t.meta}</div></div>
                <div className="test-verified">✓ Verified</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* QUIZ */}
      <div className="quiz-bg">
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 40px" }}>
          <div className="section-header fade-up">
            <div className="eyebrow">Smile Quiz</div>
            <h2 className="section-title">Find Your <em>Perfect Treatment</em></h2>
            <p className="section-sub">Answer 3 quick questions and we'll recommend the exact treatment plan for your goals.</p>
          </div>
          <div className="quiz-container fade-up">
            {!quizDone ? (
              <>
                <div className="quiz-progress"><div className="quiz-progress-fill" style={{ width: `${((quizStep + 1) / QUIZ_STEPS.length) * 100}%` }} /></div>
                <div className="quiz-step-label">Step {quizStep + 1} of {QUIZ_STEPS.length}</div>
                <div className="quiz-question">{QUIZ_STEPS[quizStep].question}</div>
                <div className="quiz-options">
                  {QUIZ_STEPS[quizStep].options.map((o, i) => (
                    <div key={i} className="quiz-option" onClick={() => handleQuizAnswer(i)}>
                      <div className="quiz-option-icon">{o.icon}</div>
                      <div>{o.label}</div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 48, marginBottom: 20 }}>✨</div>
                <div style={{ fontSize: 12, color: "var(--muted)", letterSpacing: "0.2em", textTransform: "uppercase", marginBottom: 16 }}>Your Personalized Recommendation</div>
                <div className="quiz-result">
                  <div className="quiz-result-title">{quizResult.title}</div>
                  <div className="quiz-result-desc">{quizResult.desc}</div>
                </div>
                <button className="btn-primary" style={{ margin: "0 auto 16px", display: "flex" }} onClick={scrollToBook}>Book My Free Consultation →</button>
                <button onClick={() => { setQuizStep(0); setQuizAnswers([]); setQuizDone(false); }} style={{ background: "none", border: "none", color: "var(--muted)", cursor: "pointer", fontSize: 13 }}>Retake quiz</button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* FINANCING */}
      <div className="financing-bg" id="financing">
        <div className="section">
          <div className="section-header fade-up">
            <div className="eyebrow">Financing Options</div>
            <h2 className="section-title">Your Dream Smile <em>Fits Your Budget</em></h2>
          </div>
          <div className="financing-grid fade-up">
            <div className="financing-calc">
              <span className="calc-label">Treatment Cost</span>
              <div className="calc-amount">${treatAmount.toLocaleString()}</div>
              <input type="range" className="calc-slider" min={500} max={25000} step={500} value={treatAmount}
                style={{ background: `linear-gradient(90deg, var(--gold) ${((treatAmount - 500) / 24500) * 100}%, rgba(255,255,255,0.06) ${((treatAmount - 500) / 24500) * 100}%)` }}
                onChange={e => setTreatAmount(+e.target.value)} />
              <div style={{ marginBottom: 12 }}><span className="calc-label">Payment Term</span></div>
              <div className="calc-terms">
                {[12, 18, 24, 36, 48].map(t => (
                  <div key={t} className={`calc-term ${activeTerm === t ? "active" : ""}`} onClick={() => setActiveTerm(t)}>{t}mo</div>
                ))}
              </div>
              <div className="calc-result">
                <div><div className="calc-monthly-num">${monthlyPayment}</div><div className="calc-monthly-label">/month · 0% APR available</div></div>
                <button className="btn-primary" onClick={scrollToBook}>Apply Now</button>
              </div>
            </div>
            <div className="financing-perks">
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: 40, fontWeight: 400, color: "var(--cream)", marginBottom: 16 }}>Treatment shouldn't be a financial burden.</h3>
              <p style={{ fontSize: 15, color: "var(--muted2)", lineHeight: 1.75, marginBottom: 32 }}>We believe everyone deserves to love their smile. Our flexible financing options make world-class dentistry accessible — with no hidden fees and no pressure.</p>
              {[
                { icon: "💳", title: "0% Interest for 24 Months", desc: "CareCredit and Alphaeon Credit approved patients receive zero-interest financing up to 24 months." },
                { icon: "🏦", title: "In-House Payment Plans", desc: "We offer our own 0% plans with no credit check required for qualifying treatments." },
                { icon: "🛡️", title: "Insurance Maximization", desc: "Our billing team works with 200+ PPO plans and fights to maximize your benefits before billing you." },
                { icon: "✈️", title: "Dental Tourism Support", desc: "Traveling from out of state? We offer bundled pricing, hotel partnerships, and telemedicine follow-ups." },
              ].map((p, i) => (
                <div key={i} className="financing-perk">
                  <div className="fp-icon">{p.icon}</div>
                  <div><div className="fp-title">{p.title}</div><div className="fp-desc">{p.desc}</div></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* AWARDS */}
      <div className="awards-bg">
        <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 40px" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}><div className="eyebrow">Recognition & Awards</div></div>
          <div className="awards-row">
            {[
              { icon: "🏆", name: "NY Magazine Best Dentist", year: "2021–2025" },
              { icon: "💎", name: "Invisalign Diamond Provider", year: "2019–2025" },
              { icon: "🎓", name: "AACD Accredited Fellow", year: "Since 2017" },
              { icon: "⭐", name: "Zocdoc Top Practice", year: "5 Years Running" },
              { icon: "🌟", name: "Google 4.9 Stars", year: "847+ Reviews" },
              { icon: "🔬", name: "iTero Elite Provider", year: "Since 2020" },
            ].map((a, i) => (
              <div key={i} className="award-item">
                <div className="award-icon">{a.icon}</div>
                <div className="award-name">{a.name}</div>
                <div className="award-year">{a.year}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ padding: "120px 0", background: "var(--bg2)" }}>
        <div className="section">
          <div className="section-header fade-up">
            <div className="eyebrow">Common Questions</div>
            <h2 className="section-title">Everything You <em>Need to Know</em></h2>
          </div>
          <div className="faq-grid fade-up">
            {FAQS.map((f, i) => (
              <div key={i} className={`faq-item ${openFaq === i ? "open" : ""}`}>
                <div className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="faq-q-text">{f.q}</span>
                  <div className="faq-toggle">+</div>
                </div>
                <div className="faq-answer">{f.a}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BLOG */}
      <div style={{ padding: "120px 0", background: "var(--bg)" }} id="blog">
        <div className="section">
          <div className="section-header fade-up">
            <div className="eyebrow">Education</div>
            <h2 className="section-title">From Our <em>Doctors' Desk</em></h2>
            <p className="section-sub">No fluff. Real clinical insights from practicing specialists who treat patients every day.</p>
          </div>
          <div className="blog-grid fade-up">
            {BLOG_POSTS.map((b, i) => (
              <div key={i} className="blog-card">
                <div className="blog-img"><span>{b.icon}</span><div className="blog-category">{b.cat}</div></div>
                <div className="blog-content">
                  <div className="blog-title">{b.title}</div>
                  <div className="blog-excerpt">{b.excerpt}</div>
                  <div className="blog-meta"><span className="blog-author">By {b.author}</span><span className="blog-read">{b.readTime} →</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BOOKING */}
      <div className="booking-bg" id="book">
        <div className="section">
          <div className="booking-grid fade-up">
            <div className="booking-info">
              <h2>Book Your Free <em style={{ color: "var(--gold)", fontStyle: "italic" }}>Consultation</em></h2>
              <p>Your complimentary 30-minute consultation includes a comprehensive exam, digital X-rays, 3D smile simulation, and a custom treatment plan — no obligation, ever.</p>
              {[
                { icon: "📞", lbl: "Phone", val: "(212) 555-1234" },
                { icon: "📍", lbl: "Address", val: "245 Park Avenue, Suite 2400\nNew York, NY 10167" },
                { icon: "🕐", lbl: "Hours", val: "Mon–Fri 8AM–7PM\nSat–Sun 9AM–5PM" },
              ].map((c, i) => (
                <div key={i} className="contact-item">
                  <div className="contact-icon">{c.icon}</div>
                  <div><div className="contact-lbl">{c.lbl}</div><div className="contact-val" style={{ whiteSpace: "pre-line" }}>{c.val}</div></div>
                </div>
              ))}
              <div style={{ marginTop: 32, padding: "20px 24px", background: "var(--gold-dim)", border: "1px solid var(--border)", borderRadius: 12 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: "var(--gold)", marginBottom: 6 }}>✦ What's Included — Free</div>
                <div style={{ fontSize: 13, color: "var(--muted2)", lineHeight: 1.7 }}>Comprehensive oral exam · Digital X-rays · 3D iTero scan · Digital Smile Design · Custom treatment plan · Financing review</div>
              </div>
            </div>
            <div className="booking-form">
              {formSuccess ? (
                <div style={{ textAlign: "center", padding: "60px 20px" }}>
                  <div style={{ fontSize: 56, marginBottom: 20 }}>✅</div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 28, color: "var(--cream)", marginBottom: 12 }}>You're Confirmed!</div>
                  <div style={{ fontSize: 14, color: "var(--muted2)" }}>We'll call you within 2 hours to confirm your appointment. Check your email for your complimentary smile guide.</div>
                </div>
              ) : (
                <>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 26, color: "var(--cream)", marginBottom: 32 }}>Schedule Your Visit</div>
                  <div className="form-row">
                    <div className="form-group"><label>Full Name</label><input type="text" placeholder="Alexandra Johnson" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required /></div>
                    <div className="form-group"><label>Phone Number</label><input type="tel" placeholder="(212) 555-0000" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} /></div>
                  </div>
                  <div className="form-group"><label>Email Address</label><input type="email" placeholder="alex@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} required /></div>
                  <div className="form-group">
                    <label>Primary Interest</label>
                    <select value={formData.service} onChange={e => setFormData({ ...formData, service: e.target.value })}>
                      <option value="">Select a treatment...</option>
                      {SERVICES.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
                      <option value="General / Not Sure">General / Not Sure</option>
                    </select>
                  </div>
                  <div className="form-row">
                    <div className="form-group"><label>Preferred Date</label><input type="date" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} /></div>
                    <div className="form-group">
                      <label>Preferred Time</label>
                      <select value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })}>
                        <option value="">Select time...</option>
                        {["8:00 AM","9:00 AM","10:00 AM","11:00 AM","12:00 PM","1:00 PM","2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM"].map(t => <option key={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-group"><label>Smile Goals (Optional)</label><textarea placeholder="I've always wanted to fix my..." value={formData.msg} onChange={e => setFormData({ ...formData, msg: e.target.value })} /></div>
                  <button type="button" className="btn-primary" style={{ width: "100%", justifyContent: "center", padding: "18px", fontSize: 14 }} onClick={() => setFormSuccess(true)}>Book My Free Consultation →</button>
                  <p style={{ fontSize: 11, color: "var(--muted)", textAlign: "center", marginTop: 14, lineHeight: 1.6 }}>🔒 Your information is 100% secure and will never be shared. No spam, ever.</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* LOCATION */}
      <div className="location-bg">
        <div className="location-inner">
          <div>
            <div className="eyebrow" style={{ marginBottom: 20 }}>Find Us</div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 400, color: "var(--cream)", marginBottom: 24 }}>Midtown Manhattan, <em style={{ color: "var(--gold)", fontStyle: "italic" }}>Park Avenue</em></h3>
            <div style={{ fontSize: 15, color: "var(--muted2)", marginBottom: 24 }}>245 Park Avenue, Suite 2400<br />New York, NY 10167<br /><br />2 min walk from Grand Central · Valet parking available</div>
            <div className="hours-grid">
              {[["Mon – Fri", "8:00 AM – 7:00 PM"], ["Saturday", "9:00 AM – 5:00 PM"], ["Sunday", "9:00 AM – 3:00 PM"], ["Emergencies", "24/7 On-Call"]].map(([d, h]) => (
                <div key={d} className="hours-item"><div className="hours-day">{d}</div><div className="hours-time">{h}</div></div>
              ))}
            </div>
            <button className="btn-primary" style={{ marginTop: 28 }}>Get Directions →</button>
          </div>
          <div className="location-map">
            <span style={{ fontSize: 80, opacity: 0.1 }}>🗺️</span>
            <div className="location-map-overlay">
              <span style={{ fontSize: 40 }}>📍</span>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 20, color: "var(--cream)", textAlign: "center" }}>Arcadia Dental<br />245 Park Avenue</div>
              <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 8 }}>Click to open in Maps</div>
            </div>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-top">
            <div>
              <div className="footer-logo"><div className="logo-mark" style={{ width: 28, height: 28, fontSize: 12 }}>A</div>ARCADIA DENTAL</div>
              <div className="footer-tagline">New York's premier cosmetic and restorative dentistry practice. Where art and science create extraordinary smiles.</div>
              <div className="footer-social">{["📘", "📸", "💼", "▶️", "🐦"].map((s, i) => <div key={i} className="social-btn">{s}</div>)}</div>
            </div>
            <div>
              <div className="footer-col-title">Treatments</div>
              <ul className="footer-links">{["Porcelain Veneers", "Dental Implants", "Invisalign®", "Teeth Whitening", "Full Mouth Restoration", "Same-Day Crowns", "Sleep Apnea"].map(l => <li key={l}><a href="#">{l}</a></li>)}</ul>
            </div>
            <div>
              <div className="footer-col-title">Practice</div>
              <ul className="footer-links">{["About Us", "Our Doctors", "Technology", "Patient Stories", "Blog", "Financing", "Careers"].map(l => <li key={l}><a href="#">{l}</a></li>)}</ul>
            </div>
            <div>
              <div className="footer-col-title">Connect</div>
              <ul className="footer-links">{["Book Consultation", "Patient Portal", "Insurance", "Referral Program", "Emergency Line", "Press & Media"].map(l => <li key={l}><a href="#">{l}</a></li>)}</ul>
              <div style={{ marginTop: 24, padding: "16px 20px", background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "var(--gold)", marginBottom: 10 }}>✦ Smile Insider Newsletter</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <input type="email" placeholder="your@email.com" style={{ flex: 1, background: "var(--bg)", border: "1px solid var(--border2)", borderRadius: 6, padding: "8px 12px", fontSize: 12, color: "var(--cream)", outline: "none", fontFamily: "var(--font-body)" }} />
                  <button style={{ background: "var(--gold)", border: "none", borderRadius: 6, padding: "8px 14px", fontSize: 12, fontWeight: 600, color: "var(--bg)", cursor: "pointer" }}>→</button>
                </div>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <span>© 2025 Arcadia Dental, PLLC · All rights reserved</span>
            <div className="footer-bottom-links">{["Privacy Policy", "Terms of Service", "Accessibility", "HIPAA Notice"].map(l => <a key={l} href="#">{l}</a>)}</div>
            <span>Designed with ✦ in New York</span>
          </div>
        </div>
      </footer>

      {/* FLOATING CTAs */}
      <div className="float-ctas">
        <div className="float-btn" onClick={() => window.open("tel:+12125551234")}><span>📞</span> Call Now</div>
        <div className="float-btn primary" onClick={scrollToBook}><span>✦</span> Book Free Consult</div>
      </div>

      {/* CHAT */}
      <button className="chat-bubble" style={{ position: "relative" }}>
        💬
        <div className="chat-dot" />
      </button>

      {/* COOKIE */}
      {cookie && (
        <div className="cookie-banner">
          <div className="cookie-title">🍪 We Use Cookies</div>
          <div className="cookie-text">We use cookies to personalize your experience and analyze site traffic. By clicking "Accept", you consent to our use of cookies.</div>
          <div className="cookie-btns">
            <button className="btn-cookie-accept" onClick={() => setCookie(false)}>Accept All</button>
            <button className="btn-cookie-decline" onClick={() => setCookie(false)}>Decline</button>
          </div>
        </div>
      )}
    </div>
  );
}
