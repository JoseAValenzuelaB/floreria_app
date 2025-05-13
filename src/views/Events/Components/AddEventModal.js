import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Form, Input, TextArea } from "semantic-ui-react";
import { connect } from "react-redux";
import { addNewEvent } from "../../../store/actions";


class EventModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      eventDetails: {
        title: "",
        name: "",
        eventType: "",
        time: "",
        reception: "",
        contactNumber: "",
        additionalNotes: "",
      },
      items: [],
    };
  }

  handleEventDetailsChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      eventDetails: {
        ...prevState.eventDetails,
        [name]: value,
      },
    }));
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { eventDetails, items } = this.state;
    const { selectedDate } = this.props;
    const eventDate = new Date(selectedDate);
    const [hours, minutes] = eventDetails.time.split(":");
    eventDate.setHours(hours, minutes);

    const eventWithDate = {
      ...eventDetails,
      eventDate,
      items: []
    };

    console.log("Detalles del evento:", eventWithDate);
    console.log("Elementos:", items);
    console.log("EVENT MODAL:", eventWithDate)
    this.props.addNewEvent(eventWithDate);
    this.props.onClose();
  };

  render() {
    const { isOpen } = this.props;
    const { eventDetails } = this.state;

    if (!isOpen) return null;

    return (
      <Modal open={isOpen} onClose={this.props.onClose} size="small" closeIcon>
        <Modal.Header>Crear Nuevo Evento</Modal.Header>
        <Modal.Content>
          <Form onSubmit={this.handleSubmit}>
            <Form.Field>
              <label>Nombre:</label>
              <Input
                type="text"
                name="name"
                value={eventDetails.name}
                onChange={this.handleEventDetailsChange}
                placeholder="Nombre del evento"
              />
            </Form.Field>

            <Form.Field>
              <label>Título:</label>
              <Input
                type="text"
                name="title"
                value={eventDetails.title}
                onChange={this.handleEventDetailsChange}
                placeholder="Título del evento"
              />
            </Form.Field>

            <Form.Field>
              <label>Tipo de evento:</label>
              <Input
                type="text"
                name="eventType"
                value={eventDetails.eventType}
                onChange={this.handleEventDetailsChange}
                placeholder="Tipo de evento"
              />
            </Form.Field>

            <Form.Field>
              <label>Hora:</label>
              <Input
                type="time"
                name="time"
                value={eventDetails.time}
                onChange={this.handleEventDetailsChange}
              />
            </Form.Field>

            <Form.Field>
              <label>Recepción:</label>
              <Input
                type="text"
                name="reception"
                value={eventDetails.reception}
                onChange={this.handleEventDetailsChange}
                placeholder="Recepción del evento"
              />
            </Form.Field>

            <Form.Field>
              <label>Contacto:</label>
              <Input
                type="text"
                name="contactNumber"
                value={eventDetails.contactNumber}
                onChange={this.handleEventDetailsChange}
                placeholder="Número de contacto"
              />
            </Form.Field>

            <Form.Field>
              <label>Notas Adicionales:</label>
              <TextArea
                name="additionalNotes"
                value={eventDetails.additionalNotes}
                onChange={this.handleEventDetailsChange}
                placeholder="Escribe cualquier nota adicional aquí"
              />
            </Form.Field>

            <Button type="submit" primary>
              Guardar Evento
            </Button>
          </Form>
        </Modal.Content>
      </Modal>
    );
  }
}

EventModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  addNewEvent: PropTypes.func.isRequired,
  selectedDate: PropTypes.instanceOf(Date).isRequired,
};

const actions = {
    addNewEvent
  };

export default connect(null, actions)(EventModal);
