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
  getUsers,
  saveUser,
  updateUserByID,
  deleteUser,
} from "../../store/actions";
import CustomTable from "../../components/CustomTable";
import { CONTAINERS_BORDER } from "../../utils/Colors";
import Name from "./cells/Name";
import Actions from "./cells/Actions";
import Role from "./cells/Role";
import eventManager from "../../utils/eventManager";
import Username from "./cells/Username";

const roleOptions = [
  { key: "admin", text: "Administrador", value: "admin" },
  { key: "cashier", text: "Cajero", value: "cashier" },
  { key: "florist", text: "Florista", value: "florist" },
  { key: "employee", text: "Otro", value: "employee" },
  { key: "default", text: "Predeterminado", value: "default" },
];

class UsersView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      userToDelete: null,
      confirmationModal: false,
      showAddUserModal: false,
      newUser: {
        first_name: "",
        last_name: "",
        birth_date: "",
        password: "",
        username: "",
        type: "",
        phone: "",
        salary: "",
        notes: "",
      },
      userToEdit: null,
      selectedRole: "",
      searchTerm: "",
    };
  }

  componentDidMount() {
    this.props.getUsers();

    this.callbackID = eventManager.on("user_saved", () => {
      this.props.getUsers();
      this.setState({
        newUser: {
          first_name: "",
          last_name: "",
          birth_date: "",
          password: "",
          username: "",
          type: "",
          phone: "",
          salary: "",
          notes: "",
        },
      });
    });
    
    this.callbackID = eventManager.on("user_deleted", () => {
      this.props.getUsers();
      this.setState({ deleteUser: null });
    });
  }

  componentWillUnmount() {
    eventManager.unsubscribe("user_saved", this.callbackID);
    eventManager.unsubscribe("user_deleted", this.callbackID);
  }

  onSaveClick = () => {
    const { newUser, userToEdit } = this.state;
    if (userToEdit) {
      this.props.updateUserByID({
        id: userToEdit.id,
        newValues: newUser,
      });
    } else {
      this.props.saveUser({ ...newUser, birth_date: new Date(newUser.birth_date).toISOString() });
    }

    this.setState({
      showAddUserModal: false,
      newUser: {
        first_name: "",
        last_name: "",
        birth_date: "",
        password: "",
        username: "",
        type: "",
        phone: "",
        salary: "",
        notes: "",
      },
      userToEdit: null,
    });
  };

  onEditClick = (user) => {
    this.setState({
      showAddUserModal: true,
      newUser: { ...user },
      userToEdit: user,
    });
  };

  getFilteredUsers = () => {
    const { users } = this.props;
    const { selectedRole, searchTerm } = this.state;

    return users.filter((user) => {
      const matchesRole = selectedRole ? user.type === selectedRole : true;
      const matchesSearchTerm = `${user.first_name} ${user.last_name}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesRole && matchesSearchTerm;
    });
  };

  clearFilters = () => {
    this.setState({
      selectedRole: "",
      searchTerm: "",
    });
  };

  getHeaders() {
    return [
      {
        label: "Nombre",
        component: <Name />,
        style: { background: "#F9FAFB", width: 250 },
      },
      {
        label: "Usuario",
        component: <Username />,
        style: { background: "#F9FAFB", width: 250 },
      },
      {
        label: "Rol",
        component: <Role />,
        style: { background: "#F9FAFB", width: 200 },
      },
      {
        label: "",
        component: (
          <Actions
            onRemove={(data) =>
              this.setState({ confirmationModal: true, userToDelete: data })
            }
            onEdit={(data) => this.onEditClick(data)}
          />
        ),
        style: { background: "#F9FAFB", paddingTop: 0 },
      },
    ];
  }

  render() {
    const { showAddUserModal, newUser, userToEdit } = this.state;

    return (
      <Container style={{ marginTop: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Header as="h1">Usuarios</Header>
          <Button
            content="Agregar Usuario"
            style={{ backgroundColor: "rgb(80, 135, 60)", color: "white" }}
            onClick={() => this.setState({ showAddUserModal: true })}
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
          data={this.getFilteredUsers()} // Use filtered users
        />

        <Modal
          onClose={() =>
            this.setState({ showAddUserModal: false, userToEdit: null })
          }
          open={showAddUserModal}
          size="small"
        >
          <Modal.Header>
            {userToEdit ? "Editar Usuario" : "Agregar Nuevo Usuario"}
          </Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Group widths="equal">
                <Form.Input
                  fluid
                  label="Nombre"
                  placeholder="Nombre"
                  value={newUser.first_name}
                  onChange={(e) =>
                    this.setState({
                      newUser: { ...newUser, first_name: e.target.value },
                    })
                  }
                />
                <Form.Input
                  fluid
                  label="Apellido"
                  placeholder="Apellido"
                  value={newUser.last_name}
                  onChange={(e) =>
                    this.setState({
                      newUser: { ...newUser, last_name: e.target.value },
                    })
                  }
                />
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Input
                  fluid
                  label="Usuario"
                  placeholder="Usuario"
                  value={newUser.username}
                  onChange={(e) =>
                    this.setState({
                      newUser: { ...newUser, username: e.target.value },
                    })
                  }
                />
                <Form.Input
                  fluid
                  label="Fecha de Nacimiento"
                  type="date"
                  value={newUser.birth_date}
                  onChange={(e) =>
                    this.setState({
                      newUser: { ...newUser, birth_date: e.target.value },
                    })
                  }
                />
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Input
                  fluid
                  label="Contraseña"
                  type="password"
                  placeholder="Contraseña"
                  value={newUser.password}
                  onChange={(e) =>
                    this.setState({
                      newUser: { ...newUser, password: e.target.value },
                    })
                  }
                />
                <Form.Input
                  fluid
                  label="Teléfono"
                  placeholder="Número de Teléfono"
                  value={newUser.phone}
                  onChange={(e) =>
                    this.setState({
                      newUser: { ...newUser, phone: e.target.value },
                    })
                  }
                />
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Select
                  fluid
                  label="Rol"
                  placeholder="Seleccionar Rol"
                  value={newUser.type}
                  options={roleOptions}
                  onChange={(e, { value }) =>
                    this.setState({
                      newUser: { ...newUser, type: value },
                    })
                  }
                />
              </Form.Group>
              <Form.TextArea
                label="Notas"
                placeholder="Notas adicionales"
                value={newUser.notes}
                onChange={(e) =>
                  this.setState({
                    newUser: { ...newUser, notes: e.target.value },
                  })
                }
              />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button
              content="Cancelar"
              onClick={() =>
                this.setState({ showAddUserModal: false, userToEdit: null })
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
            <p>¿Estás seguro de que deseas eliminar este usuario?</p>
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
                this.props.deleteUser(this.state.userToDelete.id);
                this.setState({ confirmationModal: false });
              }}
            />
          </Modal.Actions>
        </Modal>
      </Container>
    );
  }
}

UsersView.propTypes = {
  users: PropTypes.array,
  getUsers: PropTypes.func,
  saveUser: PropTypes.func,
  updateUserByID: PropTypes.func,
  deleteUser: PropTypes.func,
};

const mapStateToProps = (state) => ({
  users: state.app.users,
});

const mapDispatchToProps = {
  getUsers,
  saveUser,
  updateUserByID,
  deleteUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(UsersView);
