import React from "react";
import Calendar from "./components/Calendar"

export default function EventsView() {
  return (
    <div style={{ padding: 30, display: "flex", flexDirection: "column", alignItems: "center" }}>
      <h1 style={{ marginBottom: 30 }}>Calendario de Eventos</h1>
      <Calendar />
    </div>
  )
}

