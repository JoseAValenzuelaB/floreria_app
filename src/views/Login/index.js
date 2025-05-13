import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button, Form, Input, Message } from "semantic-ui-react";
import { loginUser, getUserBySession } from "../../store/actions";
import withNavigate from "../../components/NavigateWrapper";
import eventManager from "../../utils/eventManager";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      errorMessage: null,
    };
  }

  componentDidMount() {
    this.callbackID = eventManager.on("login_response", (serverResponse) => {
      if (serverResponse.isValid) {
        window.localStorage.setItem(
          "session",
          serverResponse.data.session_token
        );
        window.localStorage.setItem(
          "role",
          serverResponse.role
        );
        this.props.getUserBySession(serverResponse.data.session_token);

        if (serverResponse.role !== "cashier") {
          this.props.navigate("/home");
        } else {
          this.props.navigate("/opening-cash");
        }
      } else {
        this.setState({ errorMessage: serverResponse.message });
      }
    });
  }

  componentWillUnmount() {
    eventManager.unsubscribe("login_response", this.callbackID);
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

    this.props.loginUser(userData);
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

    return (
      <div style={styles.container}>
        <div style={styles.formWrapper}>
          <h2 style={styles.header}>Inicio de Sesión</h2>
          <Form onSubmit={this.handleSubmit}>
            <Form.Field>
              <label style={styles.label}>Usuario</label>
              <Input
                name="username"
                value={username}
                onChange={this.handleInputChange}
                placeholder="Enter your username"
                style={styles.input}
              />
            </Form.Field>
            <Form.Field>
              <label style={styles.label}>Contraseña</label>
              <Input
                name="password"
                type="password"
                value={password}
                onChange={this.handleInputChange}
                placeholder="Enter your password"
                style={styles.input}
              />
            </Form.Field>
            <Button type="submit" primary fluid style={styles.button}>
              Login
            </Button>
          </Form>

          {this.renderErrorMessage()}
        </div>
      </div>
    );
  }
}

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f5f5f5",
  },
  formWrapper: {
    width: "100%",
    maxWidth: "400px",
    padding: "20px",
    borderRadius: "8px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
  header: {
    textAlign: "center",
    marginBottom: "20px",
  },
  label: {
    marginBottom: "5px",
  },
  input: {
    marginBottom: "15px",
  },
  button: {
    marginTop: "10px",
  },
};

Login.propTypes = {
  loginUser: PropTypes.func,
  navigate: PropTypes.func,
  getUserBySession: PropTypes.func,
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { loginUser, getUserBySession })(withNavigate(Login));
