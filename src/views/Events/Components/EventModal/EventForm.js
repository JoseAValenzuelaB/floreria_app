import React, { useState } from "react";
import { Modal, Button, Form, Input } from "semantic-ui-react";

const EventModal = ({ onClose, isOpen }) => {
  const [eventDetails, setEventDetails] = useState({
    nombre: "",
    tipoEvento: "",
    hora: "",
    recepcion: "",
    contacto: "",
  });

  const handleEventDetailsChange = (e) => {
    const { name, value } = e.target;
    setEventDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission logic
    console.log("Detalles del evento:", eventDetails);
    console.log("Elementos:", items);
    onClose(); // Close the modal after submission
  };

  return (
    <Modal open={isOpen} onClose={onClose} size="small" closeIcon>
      <Modal.Header>Crear Nuevo Evento</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleSubmit}>
          <Form.Field>
            <label>Nombre:</label>
            <Input
              type="text"
              name="nombre"
              value={eventDetails.nombre}
              onChange={handleEventDetailsChange}
              placeholder="Nombre del evento"
            />
          </Form.Field>

          <Form.Field>
            <label>Tipo de evento:</label>
            <Input
              type="text"
              name="tipoEvento"
              value={eventDetails.tipoEvento}
              onChange={handleEventDetailsChange}
              placeholder="Tipo de evento"
            />
          </Form.Field>

          <Form.Field>
            <label>Hora:</label>
            <Input
              type="time"
              name="hora"
              value={eventDetails.hora}
              onChange={handleEventDetailsChange}
            />
          </Form.Field>

          <Form.Field>
            <label>Recepción:</label>
            <Input
              type="text"
              name="recepcion"
              value={eventDetails.recepcion}
              onChange={handleEventDetailsChange}
              placeholder="Recepción del evento"
            />
          </Form.Field>

          <Form.Field>
            <label>Contacto:</label>
            <Input
              type="text"
              name="contacto"
              value={eventDetails.contacto}
              onChange={handleEventDetailsChange}
              placeholder="Contacto para el evento"
            />
          </Form.Field>

          <Button type="submit" primary>
            Guardar Evento
          </Button>
        </Form>
      </Modal.Content>
    </Modal>
  );
};

export default EventModal;
