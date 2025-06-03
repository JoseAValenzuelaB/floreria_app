import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Card,
  Modal,
  Button,
  Form,
  Header,
  Segment,
  Divider,
  Statistic,
  Icon,
  Table,
  Grid,
  Label,
  Dropdown,
} from "semantic-ui-react";
import {
  getOrders,
  paySubmittedOrder,
  makeWithdrawal,
  getClients,
  saveClient,
} from "../../store/actions";
import eventManager from "../../utils/eventManager";
import withNavigate from "../../components/NavigateWrapper";
import AuthorizationModal from "../../components/AuthorizationModal";
import { PAYMENT_TYPE_DICT, PAYMENT_TYPE_VALUES } from "../../utils/constants";
import { BLUE } from "../../utils/Colors";

class ReadyToPayOrdersView extends Component {
  state = {
    selectedOrder: null,
    isCredit: false,
    modalOpen: false,
    paymentAmount: 0,
    withdrawalModalOpen: false,
    authorizationModalOpen: false,
    withdrawalAmount: 0,
    withdrawalConcept: "",
    paymentType: "CASH",
    bankAccount: "",
    selectedClient: null,
    newClientModal: false,
    newClient: {
      name: "",
      last_name: "",
      email: "",
      phone_number: "",
      address: "",
      company: "",
    },
  };

  componentDidMount() {
    this.props.getOrders();
    this.props.getClients();

    this.callbackID = eventManager.on("payment_succesfull", () => {
      this.props.getOrders();
      window.electronAPI.printTicket(this.state.selectedOrder);
      this.handleModalClose();
    });

    this.callbackIDWithdrawal = eventManager.on("withdrawal_succesfull", () => {
      this.handleWithdrawalModalClose();
    });

    this.callbackIDClient = eventManager.on("client_saved", () => {
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
        newClientModal: false,
      });
    });
  }

  componentWillUnmount() {
    eventManager.unsubscribe("withdrawal_succesfull", this.callbackID);
    eventManager.unsubscribe("payment_succesfull", this.callbackIDWithdrawal);
    eventManager.unsubscribe("client_saved", this.callbackIDClient);
  }

  componentDidUpdate(prevProps, prevState) {
    const { paymentType, selectedOrder, isCredit } = this.state;

    // Check if paymentType, selectedOrder, or isCredit changed
    const paymentTypeChanged = prevState.paymentType !== paymentType;
    const orderChanged = prevState.selectedOrder !== selectedOrder;
    const creditChanged = prevState.isCredit !== isCredit;

    if (
      (paymentTypeChanged || orderChanged || creditChanged) &&
      (paymentType === "CARD" || paymentType === "TRANSFER") &&
      !isCredit
    ) {
      this.setState({ paymentAmount: selectedOrder.total.toFixed(2) });
    }
  }

  handleCardClick = (order) => {
    this.setState({ selectedOrder: order, modalOpen: true });
  };

  handleModalClose = () => {
    this.setState({ modalOpen: false, paymentAmount: 0 });
  };

  handlePaymentChange = (e) => {
    this.setState({ paymentAmount: Number(e.target.value) });
  };

  handleSubmitPayment = () => {
    const {
      selectedOrder,
      paymentAmount,
      paymentType,
      bankAccount,
      isCredit,
      selectedClient,
    } = this.state;
    const { userData } = this.props;
    const change = paymentAmount - selectedOrder.total;

    this.props.paySubmittedOrder({
      id: selectedOrder.id,
      payment: {
        paymentType,
        bankAccount,
        change,
        isCredit,
        total: selectedOrder.total,
        paymentAmount,
        cashier: userData.first_name + " " + userData?.last_name,
        client: isCredit ? selectedClient : null,
      },
    });
  };

  // Withdrawal Modal handlers
  handleWithdrawalModalOpen = () => {
    this.setState({ withdrawalModalOpen: true });
  };

  handleWithdrawalModalClose = () => {
    this.setState({
      withdrawalModalOpen: false,
      withdrawalAmount: 0,
      withdrawalConcept: "",
    });
  };

  handleWithdrawalAmountChange = (e) => {
    this.setState({ withdrawalAmount: e.target.value });
  };

  handleWithdrawalConceptChange = (e) => {
    this.setState({ withdrawalConcept: e.target.value });
  };

  handleSubmitWithdrawal = (user) => {
    const { withdrawalAmount, withdrawalConcept } = this.state;
    const { userData } = this.props;

    this.props.makeWithdrawal({
      amount: withdrawalAmount,
      concept: withdrawalConcept,
      cashier: userData.first_name + " " + userData?.last_name,
      authorized_by: user.first_name + " " + user?.last_name,
    });
    this.setState({ authorizationModalOpen: false });
  };

  checkAmountToPay() {
    const { paymentAmount, selectedOrder, isCredit, selectedClient, paymentType, bankAccount } = this.state;

    if (isCredit && selectedClient === null) {
      return true;
    }

    if (paymentType === "TRANSFER" && !bankAccount) {
      return true;
    }

    return (
      !isCredit &&
      parseFloat(paymentAmount) < parseFloat(selectedOrder?.total || 0)
    );
  }

  handleBankAccountChange = (e) => {
    this.setState({ bankAccount: e.target.value });
  };

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

  render() {
    const { orders } = this.props;
    const {
      selectedOrder,
      modalOpen,
      paymentAmount,
      bankAccount,
      paymentType,
      withdrawalModalOpen,
      withdrawalAmount,
      withdrawalConcept,
      newClientModal,
      newClient,
    } = this.state;

    return (
      <Segment padded="very" style={{ marginTop: 20 }}>
        <Header as="h1">
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <Icon name="shopping cart" />
              <Header.Content>Pedidos Listos para Pago</Header.Content>
            </div>
            <div>
              <Button
                primary
                floated="right"
                onClick={this.handleWithdrawalModalOpen}
                navigate
              >
                Realizar Retiro
              </Button>
              {/* <Button to="/cash-report"> */}
              <Button
                primary
                floated="right"
                onClick={() => this.props.navigate("/cash-report")}
                content="Cierre de Caja"
                style={{ backgroundColor: "rgb(80, 135, 60)", color: "white" }}
              />
            </div>
          </div>
        </Header>

        <Divider />

        <Card.Group>
          {orders
            .filter((ord) => ord.status === "SUBMITTED")
            .map((order) => (
              <Card
                key={order.id}
                onClick={() => this.handleCardClick(order)}
                style={{ cursor: "pointer" }}
              >
                <Card.Content>
                  <Card.Header>Cliente: {order.buyer_name}</Card.Header>
                  <Card.Meta>
                    <span>Orden #{order.id}</span>
                  </Card.Meta>
                  <Card.Description>
                    <Statistic>
                      <Statistic.Label>Total</Statistic.Label>
                      <Statistic.Value>
                        ${order.total.toFixed(2)}
                      </Statistic.Value>
                    </Statistic>
                  </Card.Description>
                </Card.Content>
              </Card>
            ))}
        </Card.Group>

        {selectedOrder && (
          <Modal
            open={modalOpen}
            onClose={this.handleModalClose}
            size="small"
            closeIcon
            className="pos-modal"
            style={{
              borderRadius: "8px",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
              maxWidth: "600px",
              margin: "auto",
            }}
          >
            <Modal.Header
              style={{
                backgroundColor: "#f8f9fa",
                fontSize: "20px",
                fontWeight: "bold",
                textAlign: "center",
                padding: "15px",
                borderBottom: "1px solid #ddd",
              }}
            >
              Procesar Pago para Orden #{selectedOrder.id}
            </Modal.Header>
            <Modal.Content
              style={{
                padding: "20px",
                backgroundColor: "#fff",
              }}
            >
              <Header as="h3" style={{ marginBottom: "15px", color: "#333" }}>
                Detalles del Producto
              </Header>
              <Table celled style={{ marginBottom: "20px" }}>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Nombre del Producto</Table.HeaderCell>
                    <Table.HeaderCell>Cantidad</Table.HeaderCell>
                    <Table.HeaderCell>Precio</Table.HeaderCell>
                    <Table.HeaderCell>Total</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {selectedOrder.products.map((product, index) => (
                    <Table.Row key={index}>
                      <Table.Cell>{product.description}</Table.Cell>
                      <Table.Cell>{product.quantity}</Table.Cell>
                      <Table.Cell>${product.amount.toFixed(2)}</Table.Cell>
                      <Table.Cell>
                        ${(product.amount * product.quantity).toFixed(2)}
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>

              <Divider style={{ margin: "20px 0" }} />

              <Grid columns={2} stackable>
                <Grid.Row>
                  <Grid.Column>
                    <Card
                      fluid
                      style={{ boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)" }}
                    >
                      <Card.Content>
                        <Card.Header
                          style={{ fontSize: "18px", color: "#333" }}
                        >
                          Monto Total
                        </Card.Header>
                        <Card.Description
                          style={{ fontSize: "20px", color: "#333" }}
                        >
                          <Statistic size="small">
                            <Statistic.Value>
                              ${selectedOrder.total.toFixed(2)}
                            </Statistic.Value>
                          </Statistic>
                        </Card.Description>
                      </Card.Content>
                    </Card>
                  </Grid.Column>
                  <Grid.Column>
                    <Form>
                      <Form.Field>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <input
                            type="checkbox"
                            checked={this.state.isCredit}
                            onChange={() =>
                              this.setState({ isCredit: !this.state.isCredit })
                            }
                            style={{
                              marginRight: "10px",
                              width: "18px",
                              height: "18px",
                              borderRadius: "3px",
                              borderColor: "#ccc",
                            }}
                          />
                          <label
                            style={{
                              fontSize: "16px",
                              color: "#333",
                              margin: 0,
                            }}
                          >
                            Crédito
                          </label>
                        </div>
                      </Form.Field>
                      {this.state.isCredit && (
                        <Form.Field>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                            }}
                          >
                            <label style={{ fontSize: "16px", color: "#333" }}>
                              Cliente
                            </label>
                            <label
                              onClick={() =>
                                this.setState({ newClientModal: true })
                              }
                              style={{
                                cursor: "pointer",
                                textDecoration: "underline",
                                color: "#0066cc",
                                fontSize: "14px",
                              }}
                            >
                              Agregar cliente
                            </label>
                          </div>
                          <Dropdown
                            fluid
                            selection
                            value={this.state.selectedClient}
                            onChange={(event, data) =>
                              this.setState({ selectedClient: data.value })
                            }
                            options={(this.props.clients || []).map(
                              (client) => ({
                                key: client.id,
                                value: client.id,
                                text: client.last_name
                                  ? client.name + " " + client.last_name
                                  : client.name,
                              })
                            )}
                            placeholder="Seleccione un cliente"
                            style={{
                              marginTop: "10px",
                              borderRadius: "4px",
                              border: "1px solid #ccc",
                              padding: "10px",
                            }}
                          />
                        </Form.Field>
                      )}

                      <Form.Field>
                        <label style={{ fontSize: "16px", color: "#333" }}>
                          Tipo de Pago
                        </label>
                        <Dropdown
                          fluid
                          selection
                          value={paymentType}
                          onChange={(event, data) =>
                            this.setState({ paymentType: data.value })
                          }
                          options={Object.keys(PAYMENT_TYPE_DICT).map(
                            (key) => ({
                              key: key,
                              value: key,
                              text: PAYMENT_TYPE_DICT[key],
                            })
                          )}
                          style={{
                            marginTop: "10px",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                            padding: "10px",
                          }}
                        />
                      </Form.Field>

                      {paymentType === "TRANSFER" && (
                        <Form.Field>
                          <label style={{ fontSize: "16px", color: "#333" }}>
                            Cuenta Bancaria
                          </label>
                          <input
                            type="text"
                            value={bankAccount}
                            onChange={this.handleBankAccountChange}
                            placeholder="Ingrese la cuenta bancaria"
                            style={{
                              padding: "10px",
                              borderRadius: "4px",
                              border: "1px solid #ccc",
                              fontSize: "16px",
                            }}
                          />
                        </Form.Field>
                      )}

                      <Form.Field>
                        <label style={{ fontSize: "16px", color: "#333" }}>
                          Monto del Pago
                        </label>
                        <input
                          type="text"
                          value={paymentAmount}
                          onChange={this.handlePaymentChange}
                          placeholder="Ingrese el monto del pago"
                          style={{
                            padding: "10px",
                            borderRadius: "4px",
                            border: "1px solid #ccc",
                            fontSize: "16px",
                          }}
                        />
                      </Form.Field>

                      <Form.Field>
                        <label style={{ fontSize: "16px", color: "#333" }}>
                          Cambio
                        </label>
                        <Label
                          as="a"
                          color="grey"
                          image
                          style={{
                            fontSize: "16px",
                            backgroundColor: "#f1f1f1",
                            borderRadius: "4px",
                            padding: "5px 10px",
                            marginTop: "10px",
                          }}
                        >
                          <Icon name="dollar" />
                          {`${(paymentAmount - selectedOrder.total).toFixed(
                            2
                          )}`}
                        </Label>
                      </Form.Field>
                    </Form>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column
                    width={16}
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      paddingTop: "20px",
                    }}
                  >
                    <Button
                      disabled={this.checkAmountToPay()}
                      type="submit"
                      primary
                      onClick={() => this.handleSubmitPayment(false)}
                      style={{
                        backgroundColor: "#4CAF50",
                        color: "white",
                        fontSize: "16px",
                        padding: "10px 20px",
                      }}
                    >
                      Pagar
                    </Button>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Modal.Content>
          </Modal>
        )}

        {/* Withdrawal Modal */}
        <Modal
          open={withdrawalModalOpen}
          onClose={this.handleWithdrawalModalClose}
          size="small"
          closeIcon
          className="pos-modal"
        >
          <Modal.Header>Realizar Retiro</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Field>
                <label>Monto</label>
                <input
                  type="number"
                  value={withdrawalAmount}
                  onChange={this.handleWithdrawalAmountChange}
                  placeholder="Ingrese el monto"
                />
              </Form.Field>
              <Form.Field>
                <label>Concepto</label>
                <input
                  type="text"
                  value={withdrawalConcept}
                  onChange={this.handleWithdrawalConceptChange}
                  placeholder="Ingrese el concepto"
                />
              </Form.Field>
              <Button
                type="submit"
                primary
                disabled={
                  withdrawalAmount == 0 && withdrawalConcept.length == 0
                }
                onClick={() => this.setState({ authorizationModalOpen: true })}
                loading={this.props.loadings.withdrawal}
              >
                Autorizar Retiro
              </Button>
            </Form>
          </Modal.Content>
        </Modal>

        <AuthorizationModal
          isOpen={this.state.authorizationModalOpen}
          onClose={() => this.setState({ authorizationModalOpen: false })}
          onSuccess={(user) => this.handleSubmitWithdrawal(user)}
        />

        <Modal
          onClose={() => this.setState({ newClientModal: false })}
          open={newClientModal}
          size="small"
        >
          <Modal.Header>Agregar Nuevo Cliente</Modal.Header>
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
              onClick={() => this.setState({ newClientModal: false })}
            />
            <Button primary content="Guardar" onClick={this.onSaveClick} />
          </Modal.Actions>
        </Modal>
      </Segment>
    );
  }
}

ReadyToPayOrdersView.propTypes = {
  getOrders: PropTypes.func.isRequired,
  paySubmittedOrder: PropTypes.func.isRequired,
  makeWithdrawal: PropTypes.func,
  navigate: PropTypes.func,
  getClients: PropTypes.func,
  saveClient: PropTypes.func,
  orders: PropTypes.array.isRequired,
  clients: PropTypes.array,
  userData: PropTypes.object,
  loadings: PropTypes.object,
};

const actions = {
  getOrders,
  paySubmittedOrder,
  makeWithdrawal,
  getClients,
  saveClient,
};

const mapStateToProps = (state) => ({
  orders: state.app.orders,
  clients: state.app.clients,
  userData: state.app.userData,
  loadings: state.app.loadings,
});

export default connect(
  mapStateToProps,
  actions
)(withNavigate(ReadyToPayOrdersView));
