import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button, Form, Input, Message, Modal } from "semantic-ui-react";
import { authorizeUser } from "../store/actions";
import eventManager from "../utils/eventManager";

class AuthorizationModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      errorMessage: null,
    };
  }

  componentDidMount() {
    this.callbackID = eventManager.on("authorize_response", (serverResponse) => {
      if (serverResponse.isValid) {
        this.props.onSuccess(serverResponse.data);  // Call success callback from parent
      } else {
        this.setState({ errorMessage: serverResponse.message });
      }
    });
  }

  componentWillUnmount() {
    eventManager.unsubscribe("authorize_response", this.callbackID);
  }

  handleInputChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { username, password } = this.state;
    const userData = {
      username,
      password,
    };

    this.props.authorizeUser(userData);
  };

  renderErrorMessage() {
    if (this.state.errorMessage) {
      return (
        <Message
          content={this.state.errorMessage}
          negative
          style={{ marginTop: 15, marginBottom: 15 }}
        />
      );
    }
  }

  render() {
    const { username, password } = this.state;
    const { isOpen, onClose } = this.props;  // Receive props from parent

    return (
      <Modal
        open={isOpen}
        onClose={onClose}  // Call the parent’s close function when closing the modal
        size="small"
      >
        <Modal.Header>Autorización Requerida</Modal.Header>
        <Modal.Content>
          <Form onSubmit={this.handleSubmit}>
            <Form.Field>
              <label>Usuario</label>
              <Input
                name="username"
                value={username}
                onChange={this.handleInputChange}
                placeholder="Enter your username"
              />
            </Form.Field>
            <Form.Field>
              <label>Contraseña</label>
              <Input
                name="password"
                type="password"
                value={password}
                onChange={this.handleInputChange}
                placeholder="Enter your password"
              />
            </Form.Field>
            <Button type="submit" primary fluid loading={this.props.loadings.authorize}>
              Authorize
            </Button>
          </Form>

          {this.renderErrorMessage()}
        </Modal.Content>
      </Modal>
    );
  }
}

AuthorizationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,  // Modal open/close state from parent
  onClose: PropTypes.func.isRequired,  // Function to close modal
  onSuccess: PropTypes.func.isRequired,  // Function to handle success
  authorizeUser: PropTypes.func.isRequired,
  loadings: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
    loadings: state.app.loadings
});

export default connect(mapStateToProps, { authorizeUser })(AuthorizationModal);
