import TicketNum from "./TicketNum";
import "./ticket.css";

export default function Ticket({ ticket }) {
  return (
    <div className="ticket" aria-label="Current lottery ticket">
      {ticket.map((num, idx) => <TicketNum num={num} key={idx} />)}
    </div>
  );
}
