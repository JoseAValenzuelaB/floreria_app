import React from "react"
import styled from "styled-components"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import { Link } from "react-router-dom"
import formatter from "../../../utils/formatter"

const Card = styled.div`
  border: 1px solid #ddd;
  padding: 1rem;
  background-color: ${(props) => 
    props.isCurrentMonth ? (props.selected ? "#4CAF50" : "white") : "#f0f0f0"};
  width: 130px;
  height: 130px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${(props) => (props.isCurrentMonth ? "#e1f7e7" : "#f0f0f0")};
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
`

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`

const DateNumber = styled.span`
  font-weight: bold;
  font-size: 2rem;
`

const AddButton = styled.button`
  background: none;
  border: none;
  color: #4CAF50;
  cursor: pointer;
  font-size: 1.5rem;
  padding: 0.5rem;

  &:hover {
    color: #45a049;
  }
`

const EventList = styled.ul`
  list-style-type: none;
  padding: 0;
  margin: 0;
  font-size: 1rem;
  overflow: hidden;
`

const EventItem = styled.li`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 0.5rem;
`

export default function DayCard({ date, isCurrentMonth, events, onAddEvent, selected, onSelectDay }) {
  const dayNumber = new Date(date).getDate();
  return (
    <Card 
      isCurrentMonth={isCurrentMonth} 
      selected={selected} 
      onClick={() => onSelectDay(date)}
      style={{
        cursor: isCurrentMonth ? "pointer" : "default",
        opacity: isCurrentMonth ? 1 : 0.5,
      }}
    >
      <CardHeader>
        <DateNumber>{dayNumber}</DateNumber>
        <AddButton 
          onClick={(e) => {
            e.stopPropagation(); // Prevents triggering the onSelectDay event when the button is clicked
            onAddEvent(date);
          }}
        >
          +
        </AddButton>
      </CardHeader>
      {events.length > 0 ? (
        <EventList>
          {events.map((event) => (
            <EventItem key={event.id}>
              <Link to={`/event/${event.id}`}>{event.title}</Link>
            </EventItem>
          ))}
        </EventList>
      ) : (
        <p>Sin eventos</p>
      )}
    </Card>
  )
}
