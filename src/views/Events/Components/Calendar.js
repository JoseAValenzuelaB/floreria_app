import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import styled from "styled-components";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  startOfWeek,
  endOfWeek,
  addDays,
} from "date-fns";
import { es } from "date-fns/locale";
import DayCard from "./DayCard";
import AddEventModal from "./AddEventModal";
import { getEvents } from "../../../store/actions";
import formatter from "../../../utils/formatter";

const CalendarContainer = styled.div`
  max-width: 1000px;
  margin: 0 auto;
`;

const CalendarHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CalendarTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: bold;
`;

const CalendarGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.5rem;
`;

const WeekdayHeader = styled.div`
  text-align: center;
  font-weight: bold;
  padding: 0.5rem;
`;

const Button = styled.button`
  background-color: #4caf50;
  border: none;
  color: white;
  padding: 0.5rem 1rem;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 1rem;
  margin: 0.25rem;
  cursor: pointer;
  border-radius: 4px;

  &:hover {
    background-color: #45a049;
  }
`;

class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentDate: new Date(),
      isModalOpen: false,
      selectedDate: new Date(),
    };
  }

  componentDidMount() {
    this.props.getEvents();
  }

  prevMonth = () => {
    this.setState((prevState) => ({
      currentDate: new Date(
        prevState.currentDate.getFullYear(),
        prevState.currentDate.getMonth() - 1,
        1
      ),
    }));
  };

  nextMonth = () => {
    this.setState((prevState) => ({
      currentDate: new Date(
        prevState.currentDate.getFullYear(),
        prevState.currentDate.getMonth() + 1,
        1
      ),
    }));
  };

  handleSelectDay = (date) => {
    this.setState({ selectedDate: date });
  };

  handleAddEvent = (date) => {
    this.setState({ selectedDate: date, isModalOpen: true });
  };

  closeModal = () => {
    this.setState({ isModalOpen: false });
  };

  getEventsForDay = (date) => {
    return [
      {
        id: 456,
        title: "Boda de John y Mary",
        eventType: "Boda",
        eventDate: "2025-02-15T20:30:00.000Z",
        reception: "Gran Salón, Hotel Sunset",
        contactNumber: "9876543210",
        additionalNotes:
          "Se requiere vestimenta formal. Por favor confirme su asistencia antes del 1 de febrero.",
        items: [
          {
            id: 1,
            description: "Tarta de Boda",
            quantity: 1,
            pricePerUnit: 200,
            totalPrice: 200,
          },
          {
            id: 2,
            description: "Arreglos Florales",
            quantity: 10,
            pricePerUnit: 50,
            totalPrice: 500,
          },
          {
            id: 3,
            description: "Servicios Florales Adicionales",
            quantity: 1,
            pricePerUnit: 300,
            totalPrice: 300,
          },
          {
            id: 4,
            description: "Catering (Por Plato)",
            quantity: 100,
            pricePerUnit: 25,
            totalPrice: 2500,
          },
        ],
      },
    ].filter((event) => isSameDay(new Date(event.eventDate), date));
  };

  render() {
    const { currentDate, isModalOpen, selectedDate } = this.state;

    // Get the first and last day of the calendar grid
    const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 });
    const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });

    // Create all days in the grid, including placeholders
    const daysInGrid = eachDayOfInterval({ start, end });

    return (
      <CalendarContainer>
        <CalendarHeader>
          <CalendarTitle>
            {formatter.capitalize(
              format(currentDate, "MMMM yyyy", { locale: es })
            )}
          </CalendarTitle>
          <div>
            <Button onClick={this.prevMonth}>Anterior</Button>
            <Button onClick={this.nextMonth}>Siguiente</Button>
          </div>
        </CalendarHeader>
        <CalendarGrid>
          {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
            <WeekdayHeader key={day}>{day}</WeekdayHeader>
          ))}
          {daysInGrid.map((day) => (
            <DayCard
              key={day.toISOString()}
              date={day}
              isCurrentMonth={isSameMonth(day, currentDate)}
              selected={isSameDay(day, selectedDate)}
              onAddEvent={this.handleAddEvent}
              onSelectDay={this.handleSelectDay}
              events={this.getEventsForDay(day)}
              isPlaceholder={!isSameMonth(day, currentDate)}
            />
          ))}
        </CalendarGrid>
        <AddEventModal
          isOpen={isModalOpen}
          onClose={this.closeModal}
          selectedDate={selectedDate}
        />
      </CalendarContainer>
    );
  }
}

Calendar.propTypes = {
  getEvents: PropTypes.func.isRequired,
  events: PropTypes.array,
};

const mapStateToProps = (state) => ({
  events: state.app.events, // Adjust based on your state structure
});

const mapDispatchToProps = {
  getEvents,
};

export default connect(mapStateToProps, mapDispatchToProps)(Calendar);
