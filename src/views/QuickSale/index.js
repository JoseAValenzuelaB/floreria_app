import React, { Component } from "react";
import { connect } from "react-redux";
import { Container, Header, List, Segment, Button, Input, Icon, Grid } from "semantic-ui-react";
import { getProducts, saveOrder } from "../../store/actions";
import eventManager from "../../utils/eventManager";
import withNavigate from "../../components/NavigateWrapper";

class QuickSaleView extends Component {
  constructor(props) {
    super(props);

    // Set default state for a quick sale
    this.state = {
      order: {
        cashier: "12345", // Default cashier ID
        buyer_name: "********", // Anonymous buyer
        phone_number: "********", // Anonymous phone
        products: [], // Products will be added
        discount_percentage: 0, // No discount
        total: 0, // Total to be calculated
        attended_by: this.getAttendedBy(), // Default attended by
        delivery_type: "DIRECT_DELIVERY", // Default delivery type
      },
      searchTerm: "", // For product search
    };
  }

  componentDidMount() {
    this.props.getProducts();

    this.callbackID = eventManager.on("order_saved", (orderDetails) => {
      window.electronAPI.printTicket(orderDetails);
      // this.props.navigate("/dashboard");
    });
  }

  // Method to get the attended by user (default or from props)
  getAttendedBy = () => {
    const { userData } = this.props;
    return userData ? `${userData.first_name} ${userData.last_name}` : "Default Attendant";
  };

  getCashier(id) {
    const { users } = this.props

    if (!users.length) {
      return id;
    }
    const cashier = users.filter(user => user.id === id)[0];

    return cashier.first_name;
  }
  // Add a product to the order
  addProductToOrder = (product) => {
    const { order } = this.state;
    let newProducts = [...order.products];

    const index = newProducts.findIndex((itm) => itm.id === product.id);
    if (index >= 0) {
      const productFound = newProducts[index];
      newProducts[index] = {
        ...productFound,
        quantity: productFound.quantity + 1,
      };
    } else {
      newProducts.push({ ...product, quantity: 1 });
    }

    const newTotal = newProducts.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    this.setState({
      order: {
        ...order,
        products: newProducts,
        total: newTotal,
      },
    });
  };

  // Remove product from order
  removeProductFromOrder = (product) => {
    const { order } = this.state;
    const newProducts = order.products.filter((itm) => itm.id !== product.id);

    const newTotal = newProducts.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    this.setState({
      order: {
        ...order,
        products: newProducts,
        total: newTotal,
      },
    });
  };

  // Submit the order
  onSubmitOrder = () => {
    const { order } = this.state;
    const newOrder = { ...order, cashier: this.getCashier(this.props.userData.id) };
    this.props.saveOrder(newOrder);
  };

  // Search products by name
  handleSearchChange = (e) => {
    this.setState({ searchTerm: e.target.value });
  };

  // Filter products based on search term
  filteredProducts = () => {
    if (this.props.products) {
      return this.props.products.filter((product) =>
        product.name.toLowerCase().includes(this.state.searchTerm.toLowerCase())
      );
    }
    return [];
  };

  render() {
    const { order, searchTerm } = this.state;

    return (
      <Container style={{ marginTop: "20px" }}>
        <Header as="h1">Venta Rápida</Header>
        <Grid columns={2} stackable>
          {/* Left column for product search and adding/removing products */}
          <Grid.Column width={10}>
            <Segment>
              <Input
                icon="search"
                placeholder="Buscar productos..."
                onChange={this.handleSearchChange}
                value={searchTerm}
                style={{ marginBottom: "20px" }}
              />
              <List divided relaxed>
                {this.filteredProducts().map((product) => (
                  <List.Item key={product.id}>
                    <List.Content floated="right">
                      <Icon
                        name="plus"
                        onClick={() => this.addProductToOrder(product)}
                        style={{ cursor: "pointer", color: "green" }}
                      />
                    </List.Content>
                    <List.Content>
                      <List.Header>{product.name}</List.Header>
                      <List.Description>${product.price}</List.Description>
                    </List.Content>
                  </List.Item>
                ))}
              </List>
            </Segment>
          </Grid.Column>

          {/* Right column for the order summary */}
          <Grid.Column width={6}>
            <Header as="h2">Resumen de la Orden</Header>
            <Segment>
              <List divided relaxed>
                {order.products.map((product, index) => (
                  <List.Item key={index}>
                    <List.Content floated="right">
                      <Icon
                        name="remove"
                        onClick={() => this.removeProductFromOrder(product)}
                        style={{ cursor: "pointer", color: "red" }}
                      />
                    </List.Content>
                    <List.Content>
                      <List.Header>{product.name}</List.Header>
                      <List.Description>
                        ${product.price} x {product.quantity}
                      </List.Description>
                    </List.Content>
                  </List.Item>
                ))}
              </List>
              <p style={{ fontWeight: "bold", fontSize: "20px" }}>
                Total: ${order.total}
              </p>
              <Button
                primary
                onClick={this.onSubmitOrder}
                disabled={!order.products.length}
                style={{ backgroundColor: "rgb(80, 135, 60)", color: "white" }}
              >
                Confirmar Venta
              </Button>
            </Segment>
          </Grid.Column>
        </Grid>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  products: state.app.products,
  userData: state.app.userData,
  users: state.app.users,
});

const actions = {
  getProducts,
  saveOrder,
};

export default connect(mapStateToProps, actions)(withNavigate(QuickSaleView));
