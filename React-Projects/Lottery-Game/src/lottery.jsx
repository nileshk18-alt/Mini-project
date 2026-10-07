import { useMemo, useState } from "react";
import { genTicket, sum } from "./helper";
import Ticket from "./Ticket.jsx";
import "./App.css";

export default function Lottery({ n = 3, winningSum = 15 }) {
  const [ticket, setTicket] = useState(() => genTicket(n));
  const [history, setHistory] = useState([]);
  const [draws, setDraws] = useState(0);
  const [wins, setWins] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const ticketSum = useMemo(() => sum(ticket), [ticket]);
  const isWinning = ticketSum === winningSum;
  const winRate = draws ? Math.round((wins / draws) * 100) : 0;

  const buyTicket = () => {
    setIsGenerating(true);

    window.setTimeout(() => {
      const nextTicket = genTicket(n);
      const nextSum = sum(nextTicket);
      const won = nextSum === winningSum;

      setTicket(nextTicket);
      setHistory((current) => [
        { numbers: nextTicket, sum: nextSum, won },
        ...current,
      ].slice(0, 5));
      setDraws((value) => value + 1);
      setWins((value) => value + (won ? 1 : 0));
      setIsGenerating(false);
    }, 350);
  };

  const resetGame = () => {
    setTicket(genTicket(n));
    setHistory([]);
    setDraws(0);
    setWins(0);
  };

  return (
    <main className="lottery-page">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <header className="topbar">
        <div className="brand">
          <span className="brand-mark">✦</span>
          <div>
            <strong>Lucky Draw</strong>
            <small>Number challenge</small>
          </div>
        </div>
        <button className="reset-button" onClick={resetGame}>Reset game</button>
      </header>

      <section className="hero-copy">
        <span className="eyebrow">QUICK NUMBER GAME</span>
        <h1>Pick your numbers.<br /><em>Test your luck.</em></h1>
        <p>Generate a fresh ticket and see whether its total matches the winning sum.</p>
      </section>

      <section className="dashboard">
        <div className="main-card">
          <div className="card-heading">
            <div>
              <span className="label">CURRENT TICKET</span>
              <h2>Your lucky numbers</h2>
            </div>
            <span className={`status-pill ${isWinning ? "winner" : "waiting"}`}>
              {isWinning ? "Winner ✨" : "Try your luck"}
            </span>
          </div>

          <div className={`ticket-stage ${isGenerating ? "is-generating" : ""}`}>
            <Ticket ticket={ticket} />
          </div>

          <div className="ticket-total">
            <span>Ticket total</span>
            <strong>{ticketSum}</strong>
            <span className="target">Target {winningSum}</span>
          </div>

          <div className={`result-message ${isWinning ? "success" : "neutral"}`}>
            <span>{isWinning ? "🎉" : "💡"}</span>
            <div>
              <strong>{isWinning ? "Congratulations, you won!" : "Better luck next time"}</strong>
              <p>{isWinning ? "Your ticket total matches the winning sum." : `Get ${winningSum} as the ticket total to win this round.`}</p>
            </div>
          </div>

          <button className="draw-button" onClick={buyTicket} disabled={isGenerating}>
            <span>{isGenerating ? "Generating…" : "Generate new ticket"}</span>
            <span className="button-arrow">→</span>
          </button>
        </div>

        <aside className="side-panel">
          <div className="stats-grid">
            <div className="stat-card"><span>Draws</span><strong>{draws}</strong></div>
            <div className="stat-card"><span>Wins</span><strong>{wins}</strong></div>
            <div className="stat-card wide"><span>Win rate</span><strong>{winRate}%</strong></div>
          </div>

          <div className="history-card">
            <div className="history-heading">
              <div>
                <span className="label">RECENT</span>
                <h3>Draw history</h3>
              </div>
              <span>{history.length}/5</span>
            </div>

            {history.length === 0 ? (
              <div className="empty-history">
                <span>◎</span>
                <p>Your generated tickets will appear here.</p>
              </div>
            ) : (
              <div className="history-list">
                {history.map((item, index) => (
                  <div className="history-row" key={`${item.sum}-${index}`}>
                    <div className="mini-numbers">
                      {item.numbers.map((num, numberIndex) => <span key={`${num}-${numberIndex}`}>{num}</span>)}
                    </div>
                    <strong>{item.sum}</strong>
                    <span className={item.won ? "history-win" : "history-loss"}>{item.won ? "Won" : "Miss"}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </section>

      <footer>For learning and entertainment only · No real-money play</footer>
    </main>
  );
}
