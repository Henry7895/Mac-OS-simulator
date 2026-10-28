import React from "react";

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Golden Gate failed to render:", error, info.componentStack);
  }

  resetSetup = () => {
    try {
      Object.keys(window.localStorage)
        .filter((key) => key.startsWith("gg-"))
        .forEach((key) => window.localStorage.removeItem(key));
    } catch (error) {
      console.warn("Could not clear local simulator preferences", error);
    }
    window.location.replace(window.location.pathname + "?setup=1");
  };

  render() {
    if (this.state.error) {
      return (
        <main style={{
          minHeight: "100vh", display: "grid", placeItems: "center",
          padding: 24, background: "radial-gradient(circle at 50% 10%, #244e86, #101522 65%)",
          color: "#f6f8fc", fontFamily: "Inter, system-ui, sans-serif"
        }}>
          <section style={{
            width: "min(620px, 100%)", padding: 28, borderRadius: 20,
            background: "rgba(255,255,255,.09)", border: "1px solid rgba(255,255,255,.2)",
            boxShadow: "0 24px 80px rgba(0,0,0,.3)", backdropFilter: "blur(24px)"
          }}>
            <div style={{fontSize: 11, letterSpacing: 1.2, opacity: .7, fontWeight: 700}}>GOLDEN GATE · DIAGNOSTIC</div>
            <h1 style={{fontSize: 25, margin: "10px 0"}}>Le simulateur n’a pas pu démarrer.</h1>
            <p style={{lineHeight: 1.6, opacity: .82}}>Une erreur JavaScript a empêché l’interface de s’afficher. Tu peux recharger l’application ou réinitialiser uniquement les préférences de ce simulateur pour relancer la configuration.</p>
            <pre style={{whiteSpace:"pre-wrap", overflowWrap:"anywhere", padding: 12, borderRadius: 10, background:"rgba(0,0,0,.22)", fontSize: 12}}>{String(this.state.error?.message || this.state.error)}</pre>
            <div style={{display:"flex", gap:10, flexWrap:"wrap", marginTop:18}}>
              <button onClick={() => window.location.reload()} style={{padding:"10px 15px", borderRadius:10, background:"#fff", color:"#162136", fontWeight:650}}>Recharger</button>
              <button onClick={this.resetSetup} style={{padding:"10px 15px", borderRadius:10, background:"#1683f8", color:"#fff", fontWeight:650}}>Réinitialiser la configuration</button>
            </div>
          </section>
        </main>
      );
    }
    return this.props.children;
  }
}
