import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Button, Form, Input, Message } from "semantic-ui-react";
import { openingCash } from "../../store/actions";
import withNavigate from "../../components/NavigateWrapper";
import eventManager from "../../utils/eventManager";

class OpeningCash extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: "",
      password: "",
      errorMessage: null,
    };
  }

  componentDidMount() {
    this.callbackID = eventManager.on("opening_cash_succesfully", (serverResponse) => {
      if (serverResponse.isValid) {
        this.props.navigate("/home");
      } else {
        this.setState({ errorMessage: serverResponse.message });
      }
    });
  }

  componentWillUnmount() {
    eventManager.unsubscribe("opening_cash_succesfully", this.callbackID);
  }

  handleInputChange = (e, { name, value }) => {
    this.setState({ [name]: value });
  };

  handleSubmit = (e) => {
    e.preventDefault();
    const { amount } = this.state;

    this.props.openingCash({ total: amount, payment_type: "OPENING_CASH", order_id: 1500 });
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
    const { amount } = this.state;

    return (
      <div style={styles.container}>
        <div style={styles.formWrapper}>
          <h2 style={styles.header}>Apertura de Caja</h2>
          <Form onSubmit={this.handleSubmit}>
            <Form.Field>
              <label style={styles.label}>Cantidad</label>
              <Input
                name="amount"
                value={amount}
                onChange={this.handleInputChange}
                placeholder="Ingresa la cantidad de apertura"
                style={styles.input}
              />
            </Form.Field>
            <Button type="submit" primary fluid style={styles.button}>
              Continuar
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

OpeningCash.propTypes = {
  openingCash: PropTypes.func,
  navigate: PropTypes.func
};

const mapStateToProps = (state) => ({});

export default connect(mapStateToProps, { openingCash })(withNavigate(OpeningCash));
