import React, { Component } from "react";
import PropTypes from "prop-types";
import { Modal, Button, Form, Grid, Segment, Header, Input, TextArea } from "semantic-ui-react";

class DeliveryInfoModal extends Component {
  render() {
    const { open, onClose, onContinueClick, onInputChange, orderShippingDetails } = this.props;
    const today = new Date().toISOString().split("T")[0];

    return (
      <Modal open={open} onClose={onClose} size="large">
        <Modal.Content>
          <Segment>
            <Header as="h2">Información de Envío del Pedido</Header>
            <Form>
              <Grid columns={2} stackable>
                <Grid.Row>
                  <Grid.Column>
                    <Form.Field>
                      <label>Nombre del Destinatario</label>
                      <Input
                        name="recipient_name"
                        value={orderShippingDetails.recipient_name}
                        onChange={onInputChange}
                        placeholder="Nombre del Destinatario"
                      />
                    </Form.Field>
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Field>
                      <label>Fecha de Entrega</label>
                      <Input
                        type="date"
                        name="delivery_date"
                        value={orderShippingDetails.delivery_date}
                        onChange={onInputChange}
                        placeholder="Fecha de Entrega"
                        min={today}
                      />
                    </Form.Field>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <Form.Field>
                      <label>Calle</label>
                      <Input
                        name="street"
                        value={orderShippingDetails.street}
                        onChange={onInputChange}
                        placeholder="Calle"
                      />
                    </Form.Field>
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Field>
                      <label>Hora de Entrega</label>
                      <Input
                        type="time"
                        name="delivery_time"
                        value={orderShippingDetails.delivery_time}
                        onChange={onInputChange}
                        placeholder="Hora de Entrega"
                      />
                    </Form.Field>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <Form.Field>
                      <label>C.P</label>
                      <Input
                        name="postal_code"
                        value={orderShippingDetails.postal_code}
                        onChange={onInputChange}
                        placeholder="C.P"
                      />
                    </Form.Field>
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Field>
                      <label>Colonia</label>
                      <Input
                        name="neighborhood"
                        value={orderShippingDetails.neighborhood}
                        onChange={onInputChange}
                        placeholder="Colonia"
                      />
                    </Form.Field>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <Form.Field>
                      <label># Casa</label>
                      <Input
                        name="house_number"
                        value={orderShippingDetails.house_number}
                        onChange={onInputChange}
                        placeholder="# Casa"
                      />
                    </Form.Field>
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Field>
                      <label>Ciudad</label>
                      <Input
                        name="city"
                        value={orderShippingDetails.city}
                        onChange={onInputChange}
                        placeholder="Ciudad"
                      />
                    </Form.Field>
                  </Grid.Column>
                </Grid.Row>
                <Grid.Row>
                  <Grid.Column>
                    <Form.Field>
                      <label>Número de Contacto</label>
                      <Input
                        name="contact_number"
                        value={orderShippingDetails.contact_number}
                        onChange={onInputChange}
                        placeholder="Número de Contacto"
                      />
                    </Form.Field>
                  </Grid.Column>
                  <Grid.Column>
                    <Form.Field>
                      <label>Instrucciones de Entrega</label>
                      <TextArea
                        name="delivery_instructions"
                        value={orderShippingDetails.delivery_instructions}
                        onChange={onInputChange}
                        placeholder="Instrucciones de Entrega"
                      />
                    </Form.Field>
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Form>
          </Segment>
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={onClose}>Cerrar</Button>
          <Button onClick={onContinueClick}>Continuar</Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

DeliveryInfoModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onContinueClick: PropTypes.func.isRequired,
  onInputChange: PropTypes.func.isRequired,
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
  }).isRequired,
};

export default DeliveryInfoModal;
