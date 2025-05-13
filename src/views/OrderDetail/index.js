import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Grid,
  Segment,
  List,
  Header,
  Card,
  Table,
  Dimmer,
  Loader,
  Form,
  Button,
  Icon,
  Modal,
  Divider,
  Label,
  Dropdown,
} from "semantic-ui-react";
import {
  getOrderDetail,
  updateOrderDetail,
  sendCreditPayment,
} from "../../store/actions";
import withRouterParams from "../../components/ParamsWrapper";
import { PAYMENT_TYPE_DICT, DELIVERY_TYPE_DICT } from "../../utils/constants";
import formatter from "../../utils/formatter";
import PrintButton from "../../components/PrintButton";
import eventManager from "../../utils/eventManager";

class OrderDetailsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPaymentModal: false,
      isEditing: false,
      paymentAmount: 0,
      paymentType: "CASH",
      bankAccount: "",
      formData: {
        recipient_name: "",
        delivery_date: "",
        delivery_time_start: "",
        delivery_time_end: "",
        street: "",
        postal_code: "",
        neighborhood: "",
        house_number: "",
        city: "",
        contact_number: "",
        delivery_instructions: "",
      },
    };
  }

  componentDidMount() {
    const { params } = this.props;
    const orderId = params.id;
    this.props.getOrderDetail({ id: orderId });
    this.setInitialValues();

    this.callbackID = eventManager.on("order_saved", () => {
      this.props.getOrderDetail({ id: orderId });
    });
    this.callbackIDCreditPayment = eventManager.on(
      "credit_payment_succesfull",
      () => {
        this.props.getOrderDetail({ id: orderId });
        this.setState({
          showPaymentModal: false,
          paymentAmount: 0,
          paymentType: "CASH",
          bankAccount: "",
        });
      }
    );
  }

  componentWillUnmount() {
    eventManager.unsubscribe("order_saved", this.callbackID);
    eventManager.unsubscribe(
      "credit_payment_succesfull",
      this.callbackIDCreditPayment
    );
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.orderDetail !== this.props.orderDetail &&
      this.props.orderDetail?.shipping_info
    ) {
      this.setInitialValues();
    }
  }

  setInitialValues = () => {
    const { shipping_info } = this.props.orderDetail || {};
    this.setState({
      formData: {
        recipient_name: shipping_info?.recipient_name || "",
        delivery_date: shipping_info?.delivery_date || "",
        delivery_time_start: shipping_info?.delivery_time_start || "",
        delivery_time_end: shipping_info?.delivery_time_end || "",
        street: shipping_info?.street || "",
        postal_code: shipping_info?.postal_code || "",
        neighborhood: shipping_info?.neighborhood || "",
        house_number: shipping_info?.house_number || "",
        city: shipping_info?.city || "",
        contact_number: shipping_info?.contact_number || "",
        delivery_instructions: shipping_info?.delivery_instructions || "",
      },
    });
  };

  handleEditToggle = () => {
    this.setState((prevState) => ({ isEditing: !prevState.isEditing }));
  };

  handleChange = (e, { name, value }) => {
    this.setState({ formData: { ...this.state.formData, [name]: value } });
  };

  handleSave = () => {
    const { formData } = this.state;
    const { params, orderDetail } = this.props;
    this.props.updateOrderDetail({
      id: params.id,
      newValues: { ...orderDetail, shipping_info: formData },
    });
    this.setState({ isEditing: false });
  };

  handleSubmitPayment = () => {
    const { paymentAmount, paymentType, bankAccount } = this.state;
    const { params } = this.props;
    if (
      !paymentAmount ||
      isNaN(paymentAmount) ||
      parseFloat(paymentAmount) <= 0
    ) {
      alert("Por favor, introduce un monto válido.");
      return;
    }
    const newSaleNote = {
      total: parseFloat(paymentAmount),
      payment_type: paymentType,
      bank_account: bankAccount,
    };
    this.props.sendCreditPayment({ id: params.id, payment: newSaleNote });
  };

  formatLabel = (key) => {
    const labels = {
      recipient_name: "Nombre del Destinatario",
      delivery_date: "Fecha de Entrega",
      delivery_time_start: "Hora de Inicio",
      delivery_time_end: "Hora de Fin",
      street: "Calle",
      postal_code: "Código Postal",
      neighborhood: "Colonia",
      house_number: "Número de Casa",
      city: "Ciudad",
      contact_number: "Número de Contacto",
      delivery_instructions: "Instrucciones de Entrega",
    };
    return labels[key] || key;
  };

  render() {
    const { orderDetail = {}, loadings } = this.props;
    const { formData, isEditing, showPaymentModal } = this.state;
    const saleNotes = orderDetail.sale_notes || [];

    if (loadings.orderDetail) {
      return (
        <Dimmer active inverted>
          <Loader content="Cargando Detalles de la Orden..." />
        </Dimmer>
      );
    }

    const shouldShowShippingInfo = Object.values(formData).some(
      (value) => value !== ""
    );

    return (
      <Grid
        padded
        stackable
        className="pos-detail-view"
        style={{ padding: 20 }}
      >
        <Grid.Row>
          <Grid.Column width={10}>
            <Segment raised color="blue">
              <Header as="h2" color="blue">
                Detalle de la Orden
              </Header>
              <List divided relaxed size="large">
                <List.Item>
                  <strong>Cajero/a:</strong> {orderDetail?.cashier || "N/A"}
                </List.Item>
                <List.Item>
                  <strong>Comprador:</strong> {orderDetail?.buyer_name || "N/A"}
                </List.Item>
                <List.Item>
                  <strong>Contacto:</strong>{" "}
                  {orderDetail?.shipping_info?.contact_number || "N/A"}
                </List.Item>
                <List.Item>
                  <strong>Tipo de Pago:</strong>{" "}
                  {PAYMENT_TYPE_DICT[orderDetail?.payment_type] || "N/A"}
                </List.Item>
                <List.Item>
                  <strong>Entrega:</strong>{" "}
                  {DELIVERY_TYPE_DICT[orderDetail?.delivery_type] || "N/A"}
                </List.Item>
                <List.Item>
                  <strong>Descuento:</strong>{" "}
                  {orderDetail?.discount_percentage ?? "0"}%
                </List.Item>
                <List.Item>
                  <strong>Total:</strong> $
                  {orderDetail?.total?.toFixed(2) || "0.00"}
                </List.Item>
                <List.Item>
                  <strong>Comentarios:</strong>{" "}
                  {orderDetail?.additional_comments || "N/A"}
                </List.Item>
              </List>
              <Divider hidden />
              <PrintButton
                orderDetail={orderDetail?.shipping_info || {}}
                label="Imprimir Info Envío"
              />
              <PrintButton
                orderDetail={orderDetail || {}}
                label="Reimprimir Ticket"
                ticket
              />
            </Segment>
            <Segment raised color="blue">
              <Header as="h2" color="blue">
                Productos
              </Header>
              <Table celled striped selectable size="small">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Producto</Table.HeaderCell>
                    <Table.HeaderCell>Precio</Table.HeaderCell>
                    <Table.HeaderCell>Cantidad</Table.HeaderCell>
                    <Table.HeaderCell>Total</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {orderDetail.products?.map((p, i) => (
                    <Table.Row key={i}>
                      <Table.Cell>{p.description}</Table.Cell>
                      <Table.Cell>${p.amount?.toFixed(2)}</Table.Cell>
                      <Table.Cell>{p.quantity}</Table.Cell>
                      <Table.Cell>
                        ${(p.amount * p.quantity).toFixed(2)}
                      </Table.Cell>
                    </Table.Row>
                  )) || (
                    <Table.Row>
                      <Table.Cell colSpan="4" textAlign="center">
                        No hay productos
                      </Table.Cell>
                    </Table.Row>
                  )}
                </Table.Body>
              </Table>
            </Segment>
          </Grid.Column>

          <Grid.Column width={6}>
            {shouldShowShippingInfo && (
              <Segment raised color="blue">
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <Header as="h2" color="blue">
                    Información de Envío
                  </Header>
                  <Icon
                    name={isEditing ? "check" : "edit"}
                    onClick={this.handleEditToggle}
                  />
                </div>

                {isEditing ? (
                  <Form>
                    <Form.Group widths="equal">
                      <Form.Input
                        label="Nombre del Destinatario"
                        name="recipient_name"
                        value={formData.recipient_name}
                        onChange={this.handleChange}
                        placeholder="Nombre del destinatario"
                      />
                      <Form.Input
                        label="Número de Contacto"
                        name="contact_number"
                        value={formData.contact_number}
                        onChange={this.handleChange}
                        placeholder="Teléfono"
                      />
                    </Form.Group>

                    <Form.Group widths="equal">
                      <Form.Input
                        label="Fecha de Entrega"
                        name="delivery_date"
                        value={formData.delivery_date}
                        onChange={this.handleChange}
                        placeholder="YYYY-MM-DD"
                      />
                      <Form.Input
                        label="Hora de Inicio"
                        name="delivery_time_start"
                        value={formData.delivery_time_start}
                        onChange={this.handleChange}
                        placeholder="HH:MM"
                      />
                    </Form.Group>

                    <Form.Group widths="equal">
                      <Form.Input
                        label="Hora de Fin"
                        name="delivery_time_end"
                        value={formData.delivery_time_end}
                        onChange={this.handleChange}
                        placeholder="HH:MM"
                      />
                      <Form.Input
                        label="Calle"
                        name="street"
                        value={formData.street}
                        onChange={this.handleChange}
                        placeholder="Calle"
                      />
                    </Form.Group>

                    <Form.Group widths="equal">
                      <Form.Input
                        label="Número"
                        name="house_number"
                        value={formData.house_number}
                        onChange={this.handleChange}
                        placeholder="Número"
                      />
                      <Form.Input
                        label="Colonia"
                        name="neighborhood"
                        value={formData.neighborhood}
                        onChange={this.handleChange}
                        placeholder="Colonia"
                      />
                    </Form.Group>

                    <Form.Group widths="equal">
                      <Form.Input
                        label="Código Postal"
                        name="postal_code"
                        value={formData.postal_code}
                        onChange={this.handleChange}
                        placeholder="Código Postal"
                      />
                      <Form.Input
                        label="Ciudad"
                        name="city"
                        value={formData.city}
                        onChange={this.handleChange}
                        placeholder="Ciudad"
                      />
                    </Form.Group>

                    <Form.TextArea
                      label="Instrucciones de Entrega"
                      name="delivery_instructions"
                      value={formData.delivery_instructions}
                      onChange={this.handleChange}
                      placeholder="Detalles adicionales"
                    />
                  </Form>
                ) : (
                  <Grid columns={2} divided>
                    <Grid.Row>
                      <Grid.Column>
                        <strong>Destinatario:</strong>{" "}
                        {formData.recipient_name || "N/A"}
                      </Grid.Column>
                      <Grid.Column>
                        <strong>Contacto:</strong>{" "}
                        {formData.contact_number || "N/A"}
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column>
                        <strong>Fecha de Entrega:</strong>{" "}
                        {formData.delivery_date || "N/A"}
                      </Grid.Column>
                      <Grid.Column>
                        <strong>Horario:</strong>{" "}
                        {formData.delivery_time_start || "N/A"} -{" "}
                        {formData.delivery_time_end || "N/A"}
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column>
                        <strong>Calle y Número:</strong>{" "}
                        {formData.street || "N/A"} {formData.house_number || ""}
                      </Grid.Column>
                      <Grid.Column>
                        <strong>Colonia:</strong>{" "}
                        {formData.neighborhood || "N/A"}
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column>
                        <strong>CP:</strong> {formData.postal_code || "N/A"}
                      </Grid.Column>
                      <Grid.Column>
                        <strong>Ciudad:</strong> {formData.city || "N/A"}
                      </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                      <Grid.Column width={16}>
                        <strong>Instrucciones:</strong>{" "}
                        {formData.delivery_instructions || "N/A"}
                      </Grid.Column>
                    </Grid.Row>
                  </Grid>
                )}
              </Segment>
            )}

            <Segment raised color="blue">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Header as="h2" color="blue">
                  Notas de Venta
                </Header>
                {(orderDetail?.status === "IN_DEBT" ||
                  orderDetail?.status === "PARTIALLY_PAID") && (
                  <Button
                    icon
                    color="green"
                    onClick={() => this.setState({ showPaymentModal: true })}
                  >
                    <Icon name="dollar" /> Pagar
                  </Button>
                )}
              </div>
              <Card.Group itemsPerRow={1}>
                {saleNotes.length > 0 ? (
                  saleNotes.map((note, i) => (
                    <Card key={i} color="green">
                      <Card.Content>
                        <Card.Header>
                          {formatter.date(note.created_at)}
                        </Card.Header>
                        <Card.Meta>
                          {PAYMENT_TYPE_DICT[note.payment_type]}
                        </Card.Meta>
                        <Card.Description>
                          <strong>Abonado:</strong> ${note.total?.toFixed(2)}
                        </Card.Description>
                      </Card.Content>
                    </Card>
                  ))
                ) : (
                  <Label basic>No hay notas disponibles</Label>
                )}
              </Card.Group>
            </Segment>
          </Grid.Column>
        </Grid.Row>

        <Modal
          open={showPaymentModal}
          onClose={() => this.setState({ showPaymentModal: false })}
          size="small"
        >
          <Modal.Header>Pagar Crédito</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Input
                label="Monto a Pagar"
                placeholder="Introduce el monto"
                type="number"
                value={this.state.paymentAmount}
                onChange={(e, { value }) =>
                  this.setState({ paymentAmount: value })
                }
              />
              <Form.Select
                label="Tipo de Pago"
                options={Object.keys(PAYMENT_TYPE_DICT).map((key) => ({
                  key,
                  value: key,
                  text: PAYMENT_TYPE_DICT[key],
                }))}
                value={this.state.paymentType}
                onChange={(e, { value }) =>
                  this.setState({ paymentType: value })
                }
              />
              {this.state.paymentType === "TRANSFER" && (
                <Form.Input
                  label="Cuenta Bancaria"
                  value={this.state.bankAccount}
                  onChange={(e, { value }) =>
                    this.setState({ bankAccount: value })
                  }
                />
              )}
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={() => this.setState({ showPaymentModal: false })}>
              <Icon name="cancel" /> Cancelar
            </Button>
            <Button color="green" onClick={this.handleSubmitPayment}>
              <Icon name="check" /> Confirmar
            </Button>
          </Modal.Actions>
        </Modal>
      </Grid>
    );
  }
}

OrderDetailsView.propTypes = {
  params: PropTypes.object.isRequired,
  getOrderDetail: PropTypes.func,
  updateOrderDetail: PropTypes.func,
  sendCreditPayment: PropTypes.func,
  orderDetail: PropTypes.object,
  loadings: PropTypes.object,
};

const actions = {
  getOrderDetail,
  updateOrderDetail,
  sendCreditPayment,
};

const mapStateToProps = (state) => ({
  orderDetail: state.app.orderDetail,
  loadings: state.app.loadings,
});

export default connect(
  mapStateToProps,
  actions
)(withRouterParams(OrderDetailsView));
