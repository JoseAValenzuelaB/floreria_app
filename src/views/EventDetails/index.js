import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Container, Header, Form, Button, Table, Icon, Modal, Input } from "semantic-ui-react";

class EventDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      event: {
        "id": 456,
        "title": "Boda de John y Mary",
        "eventType": "Boda",
        "eventDate": "2025-02-14",
        "reception": "Gran Salón, Hotel Sunset",
        "contactNumber": "9876543210",
        "additionalNotes": "Se requiere vestimenta formal. Por favor confirme su asistencia antes del 1 de febrero.",
        "items": [
          {
            "id": 1,
            "description": "Centros de Mesa",
            "quantity": 30,
            "pricePerUnit": 350,
          },
          {
            "id": 2,
            "description": "Biombo plateado con luces mesa principal",
            "quantity": 1,
            "pricePerUnit": 4000,
          },
          {
            "id": 3,
            "description": "Renta mesa principal blanca",
            "quantity": 1,
            "pricePerUnit": 500,
          },
          {
            "id": 4,
            "description": "Arreglos passillo",
            "quantity": 6,
            "pricePerUnit": 800,
          }
        ]
      }
      ,
      newItem: {
        description: "",
        quantity: 0,
        pricePerUnit: 0,
      },
      isModalOpen: false,
      editingItemId: null,
    };

    // Vincular métodos
    this.handleEventChange = this.handleEventChange.bind(this);
    this.handleNewItemChange = this.handleNewItemChange.bind(this);
    this.addItem = this.addItem.bind(this);
    this.editItem = this.editItem.bind(this);
    this.updateItem = this.updateItem.bind(this);
    this.removeItem = this.removeItem.bind(this);
  }

  handleEventChange(e, { name, value }) {
    this.setState((prevState) => ({
      event: { ...prevState.event, [name]: value },
    }));
  }

  handleNewItemChange(e, { name, value }) {
    this.setState((prevState) => ({
      newItem: { ...prevState.newItem, [name]: value },
    }));
  }

  addItem() {
    const { newItem } = this.state;
    const totalPrice = newItem.quantity * newItem.pricePerUnit;
    const item = {
      ...newItem,
      id: Date.now(),
      totalPrice,
    };
    this.setState((prevState) => ({
      event: {
        ...prevState.event,
        items: [...prevState.event.items, item],
      },
      newItem: { description: "", quantity: 0, pricePerUnit: 0 },
    }));
  }

  editItem(id) {
    const itemToEdit = this.state.event.items.find((item) => item.id === id);
    this.setState({
      newItem: itemToEdit,
      editingItemId: id,
      isModalOpen: true,
    });
  }

  updateItem() {
    this.setState((prevState) => ({
      event: {
        ...prevState.event,
        items: prevState.event.items.map((item) =>
          item.id === prevState.editingItemId
            ? { ...prevState.newItem, totalPrice: prevState.newItem.quantity * prevState.newItem.pricePerUnit }
            : item
        ),
      },
      isModalOpen: false,
      newItem: { description: "", quantity: 0, pricePerUnit: 0 },
      editingItemId: null,
    }));
  }

  removeItem(id) {
    this.setState((prevState) => ({
      event: {
        ...prevState.event,
        items: prevState.event.items.filter((item) => item.id !== id),
      },
    }));
  }

  render() {
    const { event, newItem, isModalOpen } = this.state;
    return (
      <Container style={{ padding: 30 }}>
        <Header as="h1">Detalles del Evento</Header>
        <Form>
          <Form.Input
            fluid
            label="Título"
            name="title"
            value={event.title}
            onChange={this.handleEventChange}
          />
          <Form.Input
            fluid
            label="Tipo de Evento"
            name="eventType"
            value={event.eventType}
            onChange={this.handleEventChange}
          />
          <Form.Input
            fluid
            label="Fecha del Evento"
            name="eventDate"
            type="date"
            value={event.eventDate}
            onChange={this.handleEventChange}
          />
          <Form.Input
            fluid
            label="Recepción"
            name="reception"
            value={event.reception}
            onChange={this.handleEventChange}
          />
          <Form.Input
            fluid
            label="Número de Contacto"
            name="contactNumber"
            value={event.contactNumber}
            onChange={this.handleEventChange}
          />
          <Form.TextArea
            label="Notas Adicionales"
            name="additionalNotes"
            value={event.additionalNotes}
            onChange={this.handleEventChange}
          />
        </Form>

        <Header as="h2">Artículos</Header>
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Descripción</Table.HeaderCell>
              <Table.HeaderCell>Cantidad</Table.HeaderCell>
              <Table.HeaderCell>Precio Por Unidad</Table.HeaderCell>
              <Table.HeaderCell>Precio Total</Table.HeaderCell>
              <Table.HeaderCell>Acciones</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {event.items.map((item) => (
              <Table.Row key={item.id}>
                <Table.Cell>{item.description}</Table.Cell>
                <Table.Cell>{item.quantity}</Table.Cell>
                <Table.Cell>${item.pricePerUnit}</Table.Cell>
                <Table.Cell>${item.totalPrice}</Table.Cell>
                <Table.Cell>
                  <Button icon onClick={() => this.editItem(item.id)}>
                    <Icon name="edit" />
                  </Button>
                  <Button icon onClick={() => this.removeItem(item.id)}>
                    <Icon name="trash" />
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>

        <Form>
          <Form.Group widths="equal">
            <Form.Input
              fluid
              label="Descripción"
              name="description"
              value={newItem.description}
              onChange={this.handleNewItemChange}
            />
            <Form.Input
              fluid
              label="Cantidad"
              name="quantity"
              type="number"
              value={newItem.quantity}
              onChange={this.handleNewItemChange}
            />
            <Form.Input
              fluid
              label="Precio Por Unidad"
              name="pricePerUnit"
              type="number"
              value={newItem.pricePerUnit}
              onChange={this.handleNewItemChange}
            />
          </Form.Group>
          <Button primary onClick={this.addItem}>
            Agregar Artículo
          </Button>
        </Form>

        <Modal open={isModalOpen} onClose={() => this.setState({ isModalOpen: false })}>
          <Modal.Header>Editar Artículo</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Field>
                <label>Descripción</label>
                <Input
                  name="description"
                  value={newItem.description}
                  onChange={this.handleNewItemChange}
                />
              </Form.Field>
              <Form.Field>
                <label>Cantidad</label>
                <Input
                  name="quantity"
                  type="number"
                  value={newItem.quantity}
                  onChange={this.handleNewItemChange}
                />
              </Form.Field>
              <Form.Field>
                <label>Precio Por Unidad</label>
                <Input
                  name="pricePerUnit"
                  type="number"
                  value={newItem.pricePerUnit}
                  onChange={this.handleNewItemChange}
                />
              </Form.Field>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={() => this.setState({ isModalOpen: false })}>Cancelar</Button>
            <Button positive onClick={this.updateItem}>
              Actualizar
            </Button>
          </Modal.Actions>
        </Modal>
      </Container>
    );
  }
}

EventDetails.propTypes = {
  // Puedes definir props adicionales aquí según tu estado de Redux o acciones
};

const mapStateToProps = (state) => ({
  // Mapea las propiedades del estado a props
});

const mapDispatchToProps = (dispatch) => ({
  // Mapea tus acciones de dispatch a props
});

export default connect(mapStateToProps, mapDispatchToProps)(EventDetails);
