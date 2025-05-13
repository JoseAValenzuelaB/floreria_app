import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Card, Form, Grid, Header, Icon, Input, Message, Table } from 'semantic-ui-react';

class POSPayment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: '' // Initialize error state
    };
  }

  // Handle payment input changes
  handlePaymentChange = (e) => {
    this.props.onPaymentChange(e.target.value);
  };

  // Validate and process the payment
  handlePayment = () => {
    const paymentAmount = parseFloat(this.props.payment);
    if (isNaN(paymentAmount) || paymentAmount < this.props.total) {
      this.setState({
        error: 'Insufficient payment amount',
      });
    } else {
      this.setState({
        error: '',
      });
      this.props.onProcessPayment();
    }
  };

  render() {
    const { products, total, payment, change } = this.props;
    const { error } = this.state;

    return (
      <Grid centered>
        <Grid.Column width={12}>
          <Card fluid>
            <Card.Content>
              <Card.Header textAlign="center">
                <Header as="h2">Purchase Summary & Payment</Header>
              </Card.Header>
            </Card.Content>
            <Card.Content>
              <Table celled>
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Product</Table.HeaderCell>
                    <Table.HeaderCell>Price</Table.HeaderCell>
                    <Table.HeaderCell>Quantity</Table.HeaderCell>
                    <Table.HeaderCell textAlign="right">Subtotal</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {products.map((product) => (
                    <Table.Row key={product.id}>
                      <Table.Cell>{product.name}</Table.Cell>
                      <Table.Cell>${product.price.toFixed(2)}</Table.Cell>
                      <Table.Cell>{product.quantity}</Table.Cell>
                      <Table.Cell textAlign="right">${(product.price * product.quantity).toFixed(2)}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>

              <Grid columns={2}>
                <Grid.Column textAlign="right">
                  <Header as="h3">Total</Header>
                  <Header as="h2">${total.toFixed(2)}</Header>
                </Grid.Column>
              </Grid>

              <Form>
                <Form.Field>
                  <label>Payment Amount</label>
                  <Input
                    type="number"
                    value={payment}
                    onChange={this.handlePaymentChange}
                    placeholder="Enter payment amount"
                    label={{ basic: true, content: '$' }}
                    labelPosition="left"
                  />
                </Form.Field>
              </Form>

              {error && (
                <Message negative>
                  <Icon name="warning circle" />
                  {error}
                </Message>
              )}

              {change > 0 && (
                <Grid columns={2}>
                  <Grid.Column textAlign="right">
                    <Header as="h3">Change</Header>
                    <Header as="h2" color="green">${change.toFixed(2)}</Header>
                  </Grid.Column>
                </Grid>
              )}
            </Card.Content>

            <Card.Content extra>
              <Button primary fluid size="large" onClick={this.handlePayment}>
                Process Payment
              </Button>
            </Card.Content>
          </Card>
        </Grid.Column>
      </Grid>
    );
  }
}

// PropTypes validation
POSPayment.propTypes = {
  products: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      quantity: PropTypes.number.isRequired,
    })
  ).isRequired,
  total: PropTypes.number.isRequired,
  payment: PropTypes.string.isRequired,
  change: PropTypes.number.isRequired,
  onPaymentChange: PropTypes.func,
  onProcessPayment: PropTypes.func,
};

export default POSPayment;
