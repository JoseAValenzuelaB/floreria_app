import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Segment, Grid, Header, Table, TextArea, Form } from "semantic-ui-react";

class OrderSummaryModal extends Component {
  render() {
    const { open, onClose, onSendClick, orderDetails, discount, onDiscountChange } = this.props;

    return (
      <Modal open={open} onClose={onClose} size="large">
        <Modal.Header>Resumen del Pedido</Modal.Header>
        <Modal.Content>
          <Segment>
            <Grid stackable>
              {/* Order Details */}
              <Grid.Row columns={4}>
                <Grid.Column>
                  <Header as="h4">Nombre del Comprador:</Header>
                  <p>{orderDetails.buyer_name}</p>
                </Grid.Column>
                <Grid.Column>
                  <Header as="h4">Tipo de Pago:</Header>
                  <p>{orderDetails.payment_type}</p>
                </Grid.Column>
                <Grid.Column>
                  <Header as="h4">Número de Teléfono:</Header>
                  <p>{orderDetails.phone_number}</p>
                </Grid.Column>
                <Grid.Column>
                  <Header as="h4">Atendido Por:</Header>
                  <p>{orderDetails.attended_by}</p>
                </Grid.Column>
              </Grid.Row>

              {/* Delivery Information */}
              {orderDetails.delivery_type === "HOME_DELIVERY" && orderDetails.orderShippingDetails && (
                <>
                  <Grid.Row columns={4}>
                    <Grid.Column>
                      <Header as="h4">Nombre del Destinatario:</Header>
                      <p>{orderDetails.orderShippingDetails.recipient_name}</p>
                    </Grid.Column>
                    <Grid.Column>
                      <Header as="h4">Fecha de Entrega:</Header>
                      <p>{orderDetails.orderShippingDetails.delivery_date}</p>
                    </Grid.Column>
                    <Grid.Column>
                      <Header as="h4">Hora de Entrega:</Header>
                      <p>{orderDetails.orderShippingDetails.delivery_time}</p>
                    </Grid.Column>
                    <Grid.Column>
                      <Header as="h4">Calle:</Header>
                      <p>{orderDetails.orderShippingDetails.street}</p>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row columns={4}>
                    <Grid.Column>
                      <Header as="h4">C.P.:</Header>
                      <p>{orderDetails.orderShippingDetails.postal_code}</p>
                    </Grid.Column>
                    <Grid.Column>
                      <Header as="h4">Colonia:</Header>
                      <p>{orderDetails.orderShippingDetails.neighborhood}</p>
                    </Grid.Column>
                    <Grid.Column>
                      <Header as="h4"># Casa:</Header>
                      <p>{orderDetails.orderShippingDetails.house_number}</p>
                    </Grid.Column>
                    <Grid.Column>
                      <Header as="h4">Ciudad:</Header>
                      <p>{orderDetails.orderShippingDetails.city}</p>
                    </Grid.Column>
                  </Grid.Row>
                  <Grid.Row columns={2}>
                    <Grid.Column>
                      <Header as="h4">Número de Contacto:</Header>
                      <p>{orderDetails.orderShippingDetails.contact_number}</p>
                    </Grid.Column>
                    <Grid.Column>
                      <Header as="h4">Instrucciones de Entrega:</Header>
                      <p>{orderDetails.orderShippingDetails.delivery_instructions}</p>
                    </Grid.Column>
                  </Grid.Row>
                </>
              )}

              {/* Discount and Comments */}
              <Grid.Row columns={2}>
                <Grid.Column>
                  <Header as="h4">Descuento:</Header>
                  <p>{discount}%</p>
                </Grid.Column>
                <Grid.Column>
                  <Header as="h4">Comentarios Adicionales:</Header>
                  <Form>
                    <TextArea
                      placeholder="Agrega comentarios adicionales..."
                      value={orderDetails.additional_comments}
                      onChange={(e) => onDiscountChange(e.target.value)}
                    />
                  </Form>
                </Grid.Column>
              </Grid.Row>

              {/* Products Table */}
              <Grid.Row>
                <Grid.Column>
                  <Header as="h3">Productos</Header>
                  <Table celled>
                    <Table.Header>
                      <Table.Row>
                        <Table.HeaderCell>Producto</Table.HeaderCell>
                        <Table.HeaderCell>Cantidad</Table.HeaderCell>
                        <Table.HeaderCell>Precio</Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {orderDetails.products.map((product, index) => (
                        <Table.Row key={index}>
                          <Table.Cell>{product.name}</Table.Cell>
                          <Table.Cell>{product.quantity}</Table.Cell>
                          <Table.Cell>
                            {product.price * product.quantity}
                          </Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Segment>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={onClose}>Cerrar</Button>
          <Button primary onClick={onSendClick}>
            Confirmar y Enviar Pedido
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

OrderSummaryModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSendClick: PropTypes.func.isRequired,
  orderDetails: PropTypes.shape({
    buyer_name: PropTypes.string,
    payment_type: PropTypes.string,
    phone_number: PropTypes.string,
    attended_by: PropTypes.string,
    delivery_type: PropTypes.string,  // Add delivery_type to the prop types
    orderShippingDetails: PropTypes.shape({
      recipient_name: PropTypes.string,
      delivery_date: PropTypes.string,
      delivery_time: PropTypes.string,
      street: PropTypes.string,
      postal_code: PropTypes.string,
      neighborhood: PropTypes.string,
      house_number: PropTypes.string,
      city: PropTypes.string,
      contact_number: PropTypes.string,
      delivery_instructions: PropTypes.string,
    }),
    products: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        price: PropTypes.number,
        quantity: PropTypes.number,
      })
    ),
    additional_comments: PropTypes.string,
  }).isRequired,
  discount: PropTypes.number.isRequired,
  onDiscountChange: PropTypes.func.isRequired,
};

export default OrderSummaryModal;
