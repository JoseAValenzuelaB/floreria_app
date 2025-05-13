import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Button,
  Container,
  Header,
  Modal,
  Form,
} from "semantic-ui-react";
import {
  getClients,
  saveClient,
  editClient,
  deleteClient,
} from "../../store/actions";
import CustomTable from "../../components/CustomTable";
import { CONTAINERS_BORDER } from "../../utils/Colors";
import Name from "./cells/Name";
import Actions from "./cells/Actions";
import eventManager from "../../utils/eventManager";
import Email from "./cells/Email";
import Company from "./cells/Company";
import Phone from "./cells/PhoneNumber";

class ClientsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      clients: [],
      clientToDelete: null,
      confirmationModal: false,
      showAddClientModal: false,
      newClient: {
        name: "",
        last_name: "",
        email: "",
        phone_number: "",
        address: "",
        company: "",
      },
      clientToEdit: null,
      searchTerm: "",
    };
  }

  componentDidMount() {
    this.props.getClients();

    this.callbackID = eventManager.on("client_saved", () => {
      this.props.getClients();
      this.setState({
        newClient: {
          name: "",
          last_name: "",
          email: "",
          phone_number: "",
          address: "",
          company: "",
        },
      });
    });
  }

  componentWillUnmount() {
    eventManager.unsubscribe("client_saved", this.callbackID);
  }

  onSaveClick = () => {
    const { newClient, clientToEdit } = this.state;
    if (clientToEdit) {
      this.props.editClient({
        id: clientToEdit.id,
        newValues: newClient,
      });
    } else {
      this.props.saveClient(newClient);
    }

    this.setState({
      showAddClientModal: false,
      newClient: {
        name: "",
        last_name: "",
        email: "",
        phone_number: "",
        address: "",
        company: "",
      },
      clientToEdit: null,
    });
  };

  onEditClick = (client) => {
    this.setState({
      showAddClientModal: true,
      newClient: { ...client },
      clientToEdit: client,
    });
  };

  getFilteredClients = () => {
    const { clients } = this.props;
    const { searchTerm } = this.state;

    return clients.filter((client) => {
      const fullName = `${client.name} ${client.last_name}`.toLowerCase();
      return fullName.includes(searchTerm.toLowerCase());
    });
  };

  clearFilters = () => {
    this.setState({ searchTerm: "" });
  };

  getHeaders() {
    return [
      {
        label: "Nombre",
        component: <Name />,
        style: { background: "#F9FAFB", width: 250 },
      },
      {
        label: "Empresa",
        component: <Company />,
        style: { background: "#F9FAFB", width: 250 },
      },
      {
        label: "Correo",
        component: <Email />,
        style: { background: "#F9FAFB", width: 250 },
      },
      {
        label: "Tel/Cel",
        component: <Phone />,
        style: { background: "#F9FAFB", width: 250 },
      },
      {
        label: "",
        component: (
          <Actions
            onRemove={(data) =>
              this.setState({ confirmationModal: true, clientToDelete: data })
            }
            onEdit={(data) => this.onEditClick(data)}
          />
        ),
        style: { background: "#F9FAFB", paddingTop: 0 },
      },
    ];
  }

  render() {
    const { showAddClientModal, newClient, clientToEdit } = this.state;

    return (
      <Container style={{ marginTop: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Header as="h1">Clientes</Header>
          <Button
            content="Agregar Cliente"
            style={{ backgroundColor: "rgb(80, 135, 60)", color: "white" }}
            onClick={() => this.setState({ showAddClientModal: true })}
          />
        </div>
        <CustomTable
          style={{
            border: CONTAINERS_BORDER,
            borderRadius: 10,
            overflow: "hidden",
          }}
          footerStyle={{ background: "#F9FAFB" }}
          orderDirection="ascending"
          headers={this.getHeaders()}
          data={this.getFilteredClients()} // Use filtered clients
        />

        <Modal
          onClose={() =>
            this.setState({ showAddClientModal: false, clientToEdit: null })
          }
          open={showAddClientModal}
          size="small"
        >
          <Modal.Header>
            {clientToEdit ? "Editar Cliente" : "Agregar Nuevo Cliente"}
          </Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Input
                fluid
                label="Nombre"
                placeholder="Nombre"
                value={newClient.name}
                onChange={(e) =>
                  this.setState({
                    newClient: { ...newClient, name: e.target.value },
                  })
                }
              />
              <Form.Input
                fluid
                label="Apellido"
                placeholder="Apellido"
                value={newClient.last_name}
                onChange={(e) =>
                  this.setState({
                    newClient: { ...newClient, last_name: e.target.value },
                  })
                }
              />
              <Form.Input
                fluid
                label="Correo"
                placeholder="Correo"
                type="email"
                value={newClient.email}
                onChange={(e) =>
                  this.setState({
                    newClient: { ...newClient, email: e.target.value },
                  })
                }
              />
              <Form.Input
                fluid
                label="Teléfono"
                placeholder="Número de Teléfono"
                value={newClient.phone_number}
                onChange={(e) =>
                  this.setState({
                    newClient: { ...newClient, phone_number: e.target.value },
                  })
                }
              />
              <Form.Input
                fluid
                label="Dirección"
                placeholder="Dirección"
                value={newClient.address}
                onChange={(e) =>
                  this.setState({
                    newClient: { ...newClient, address: e.target.value },
                  })
                }
              />
              <Form.Input
                fluid
                label="Compañía (opcional)"
                placeholder="Compañía"
                value={newClient.company}
                onChange={(e) =>
                  this.setState({
                    newClient: { ...newClient, company: e.target.value },
                  })
                }
              />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button
              content="Cancelar"
              onClick={() =>
                this.setState({ showAddClientModal: false, clientToEdit: null })
              }
            />
            <Button primary content="Guardar" onClick={this.onSaveClick} />
          </Modal.Actions>
        </Modal>

        <Modal
          onClose={() => this.setState({ confirmationModal: false })}
          open={this.state.confirmationModal}
          size="mini"
        >
          <Modal.Header>Confirmar Eliminación</Modal.Header>
          <Modal.Content>
            <p>¿Estás seguro de que deseas eliminar este cliente?</p>
          </Modal.Content>
          <Modal.Actions>
            <Button
              content="Cancelar"
              onClick={() => this.setState({ confirmationModal: false })}
            />
            <Button
              negative
              icon="trash"
              labelPosition="right"
              content="Eliminar"
              onClick={() => {
                this.props.deleteClient(this.state.clientToDelete.id);
                this.setState({ confirmationModal: false });
              }}
            />
          </Modal.Actions>
        </Modal>
      </Container>
    );
  }
}

ClientsView.propTypes = {
  clients: PropTypes.array,
  getClients: PropTypes.func,
  saveClient: PropTypes.func,
  editClient: PropTypes.func,
  deleteClient: PropTypes.func,
};

const mapStateToProps = (state) => ({
  clients: state.app.clients,
});

const mapDispatchToProps = {
  getClients,
  saveClient,
  editClient,
  deleteClient,
};

export default connect(mapStateToProps, mapDispatchToProps)(ClientsView);
