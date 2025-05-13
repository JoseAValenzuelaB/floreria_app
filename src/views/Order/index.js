import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Container,
  Form,
  Input,
  Button,
  Header,
  List,
  Segment,
  Grid,
  Modal,
  Icon,
  Checkbox,
  Dropdown,
  TextArea,
} from "semantic-ui-react";
import { getPrices, saveOrder, getUsers } from "../../store/actions";
import eventManager from "../../utils/eventManager";
import withNavigate from "../../components/NavigateWrapper";
import OrderSummaryModal from "./OrderSummaryModal";
import DeliveryInfoModal from "./DeliveryInfoModal";
import BarcodeScanner from "../../components/BarcodeScanner";


const deliveryTypes = [
  {
    key: "HOME_DELIVERY",
    text: "Entrega a Domicilio",
    value: "HOME_DELIVERY",
  },
  {
    key: "STORE_PICKUP",
    text: "Recoger en Sucursal",
    value: "STORE_PICKUP",
  },
  {
    key: "DIRECT_DELIVERY",
    text: "Entrega Directa",
    value: "DIRECT_DELIVERY",
  },
];

class OrderView extends Component {
  constructor(props) {
    super(props);

    this.state = {
      order: {
        cashier: "12345",
        buyer_name: "",
        phone_number: "",
        products: [],
        discount_percentage: 0,
        total: 0,
        attended_by: "",
        delivery_type: "",
        additional_comments: "",
        user_id: 1,
      },
      orderShippingDetails: {
        recipient_name: "",
        delivery_date: "",
        delivery_time: "",
        street: "",
        postal_code: "",
        neighborhood: "",
        house_number: "",
        city: "",
        contact_number: "",
        delivery_instructions: "",
      },
      searchTerm: "",
      scanningProduct: false,
      showOrderReviewModal: false,
      isDeliveryInfoOpen: false,
      extraCharge: "",
    };
  }

  componentDidMount() {
    this.props.getPrices();
    this.props.getUsers();

    this.callbackID = eventManager.on("order_saved", (orderDetails) => {
      window.electronAPI.printTicket(orderDetails);
      this.props.navigate("/dashboard");
    });
  }

  addProductToOrder = (product) => {
    const { order } = this.state;
    let newProducts = [...order.products];

    // Check if the product is "Cargo extra"
    if (product.name === "Cargo extra") {
      // Remove any existing "Cargo extra" products
      newProducts = newProducts.filter((itm) => itm.name !== "Cargo extra");
      // Add the new Cargo extra product at the end
      newProducts.push({ ...product, quantity: 1 });
    } else {
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
    }

    // Sort products to ensure "Cargo extra" is at the end
    newProducts.sort((a, b) => {
      if (a.name === "Cargo extra") return 1; // Move Cargo extra to the bottom
      if (b.name === "Cargo extra") return -1; // Keep other products above Cargo extra
      return 0; // Leave other products in original order
    });

    const newTotal = newProducts.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    this.setState({
      order: {
        ...order,
        products: newProducts,
        total: newTotal - (newTotal * order.discount_percentage) / 100,
      },
    });
  };

  removeProductFromOrder = (product) => {
    const index = this.state.order.products.findIndex(
      (itm) => itm.id === product.id
    );
    const newProducts = [...this.state.order.products];

    if (index >= 0) {
      const productFound = this.state.order.products[index];

      if (productFound.quantity > 1) {
        // If quantity is more than 1, reduce the quantity by 1
        newProducts[index] = {
          ...productFound,
          quantity: productFound.quantity - 1,
        };
      } else {
        // If it's the last one, remove it from the order
        newProducts.splice(index, 1);
      }
    }

    const newTotal = newProducts.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    this.setState({
      order: {
        ...this.state.order,
        products: newProducts,
        total:
          newTotal - (newTotal * this.state.order.discount_percentage) / 100,
      },
    });
  };

  handleDeliveryInputChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      orderShippingDetails: {
        ...prevState.orderShippingDetails,
        [name]: value,
      },
    }));
  };

  handleOnSumbitOrderClick = () => {
    const { order } = this.state;

    if (order.delivery_type === "HOME_DELIVERY") {
      this.setState({ isDeliveryInfoOpen: true });
    } else {
      this.setState({ showOrderReviewModal: true })
    }
  };

  handleInputChange = (e, { name, value }) => {
    this.setState({
      order: { ...this.state.order, [name]: value },
    });
  };

  handleSearchChange = (e, { value }) => {
    this.setState({ searchTerm: value });
  };

  handleScanProduct = () => {
    this.setState({ scanningProduct: true });
    setTimeout(() => {
      this.setState({ scanningProduct: false });
      alert("Producto escaneado: Producto de ejemplo");
    }, 2000); // Simulate 2 seconds delay
  };

  filteredProducts = () => {
    if (this.props.prices) {
      return this.props.prices.filter((price) =>
        price.description.toLowerCase().includes(this.state.searchTerm.toLowerCase())
      );
    }

    return [];
  };

  getCashier(id) {
    const { users } = this.props

    if (!users.length) {
      return id;
    }
    const cashier = users.filter(user => user.id === id)[0];

    return cashier.first_name;
  }

  onSendOrderClick() {
    const { order, orderShippingDetails } = this.state;
    const newOrder = { ...order, shipping_info: orderShippingDetails, cashier: this.getCashier(this.props.userData.id) };
    this.props.saveOrder(newOrder);
  }

  isOrderComplete = () => {
    const { order } = this.state;

    const isProductsNotEmpty = order.products && order.products.length > 0;
    const isBuyerNameFilled =
      order.buyer_name && order.buyer_name.trim() !== "";
    const isPhoneNumberFilled =
      order.phone_number && order.phone_number.trim() !== "";
    const isAttendedByFilled =
      order.attended_by && order.attended_by.trim() !== "";

    return (
      isProductsNotEmpty &&
      isBuyerNameFilled &&
      isPhoneNumberFilled &&
      isAttendedByFilled
    );
  };

  addExtraCharge = () => {
    const { extraCharge } = this.state;
    const chargeAmount = parseFloat(extraCharge);

    if (!isNaN(chargeAmount) && chargeAmount > 0) {
      const newProduct = {
        name: "Cargo extra",
        price: chargeAmount,
        quantity: 1,
      };

      // Assuming you have a method to add products to the order
      this.addProductToOrder(newProduct);
      this.setState({ extraCharge: "" }); // Clear the input field
    }
  };

  getEmployeesOptions() {
    const { users } = this.props;

    if (!users.length) {
      return [
        {
          key: "-",
          text: "-",
          value: "-",
        }
      ];
    }

    return users.filter(user => user.type !== "admin").map(user => {
      return {
        key: user.id,
        text: user.first_name + " " + user?.last_name,
        value: user.first_name + " " + user?.last_name,
      };
    })
  }

  findProductByBarcode(barcode) {
    const products = this.props.prices || [];
    const productFounded = products.find((product) => String(product.id) === barcode);
    this.addProductToOrder({ id: productFounded.id, name: productFounded.description, price: productFounded.amount });
  }

  render() {
    const { order, searchTerm, scanningProduct, extraCharge, orderShippingDetails } = this.state;

    return (
      <Container style={{ marginTop: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Header as="h1">Crear Nueva Orden</Header>
        </div>
        <Grid columns={2} stackable>
          <Grid.Column width={10}>
            <Form>
              <Form.Field>
                <div
                  style={{ display: "flex", justifyContent: "space-between" }}
                >
                  <label>Nombre del Comprador</label>
                  <Checkbox
                    label={"Anónimo"}
                    onChange={(e, { checked }) =>
                      this.setState({
                        order: {
                          ...order,
                          buyer_name: checked ? "********" : "",
                          phone_number: checked ? "********" : "",
                        },
                      })
                    }
                    style={{ fontWeight: "bold" }}
                  />
                </div>
                <Input
                  name="buyer_name"
                  value={order.buyer_name}
                  onChange={this.handleInputChange}
                />
              </Form.Field>
              <div style={{ display: "flex" }}>
                <Form.Field style={{ width: "50%" }}>
                  <label>Tel/Cel</label>
                  <Input
                    name="phone_number"
                    value={order.phone_number}
                    onChange={this.handleInputChange}
                  />
                </Form.Field>
                <Form.Field style={{ width: "50%", marginLeft: 10, }}>
                  <label>Tipo de Venta/Entrega</label>
                  <Dropdown
                    placeholder="Seleccionar"
                    fluid
                    selection
                    options={deliveryTypes}
                    onChange={(e, data) =>
                      this.setState({
                        order: { ...order, delivery_type: data.value },
                      })
                    }
                  />
                </Form.Field>
              </div>
              <div style={{ display: "flex" }}>
                <div style={{ width: "49%" }}>
                  <Form.Field>
                    <label>Atendido Por:</label>
                    <Dropdown
                      placeholder="Seleccionar"
                      fluid
                      selection
                      options={this.getEmployeesOptions()}
                      onChange={(e, data) =>
                        this.setState({
                          order: { ...order, attended_by: data.value },
                        })
                      }
                    />
                  </Form.Field>
                </div>
              </div>
            </Form>
            <Form style={{ marginTop: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <p>Productos</p>
                  <Input
                    icon="search"
                    placeholder="Buscar productos..."
                    onChange={this.handleSearchChange}
                    value={searchTerm}
                    style={{ marginBottom: "10px", marginLeft: 10 }}
                  />
                </div>
                <div>
                  {/* Button to open scanning modal */}
                  <Button
                    floated="right"
                    icon="qrcode"
                    onClick={() => this.setState({ scanningProduct: true })}
                    style={{
                      backgroundColor: "rgb(80, 135, 60)",
                      color: "white",
                    }}
                  />
                </div>
              </div>
              <List divided relaxed>
                {this.filteredProducts().map((product) => (
                  <List.Item key={product.id}>
                    <List.Content floated="right">
                      {/* <Button
                        onClick={() => this.addProductToOrder(product)}
                        style={{
                          backgroundColor: "rgb(80, 135, 60)",
                          color: "white",
                        }}
                      >
                        Agregar a la Orden
                      </Button> */}
                      <Icon
                        name="plus"
                        onClick={() => this.addProductToOrder({ id: product.id, name: product.description, price: product.amount })}
                        style={{ cursor: "pointer" }}
                      />
                    </List.Content>
                    <List.Content>
                      <List.Header>{product.description}</List.Header>
                      <List.Description>${product.amount}</List.Description>
                    </List.Content>
                  </List.Item>
                ))}
              </List>
            </Form>
          </Grid.Column>
          <Grid.Column width={6}>
            <Header as="h2">Resumen de la Orden</Header>
            <Segment.Group>
              <Segment>
                <List divided relaxed>
                  {order.products.map((product, index) => (
                    <List.Item key={index}>
                      <List.Content>
                        <List.Header>{product.name}</List.Header>
                        <List.Description>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <div>
                              ${product.price} x {product.quantity}
                            </div>
                            <Icon
                              name="remove"
                              onClick={() =>
                                this.removeProductFromOrder(product)
                              }
                              style={{
                                cursor: "pointer",
                                marginLeft: "10px",
                                color: "red",
                              }}
                              title="Remove product"
                            />
                          </div>
                        </List.Description>
                      </List.Content>
                    </List.Item>
                  ))}
                </List>
                <p style={{ fontWeight: "bold", fontSize: 20 }}>
                  Total: ${order.total}
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginTop: "10px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <label>Cargo Extra</label>
                    <input
                      type="number"
                      placeholder="0"
                      value={extraCharge}
                      onChange={(e) =>
                        this.setState({ extraCharge: e.target.value })
                      }
                      style={{ marginLeft: 10, width: 100, marginBottom: 0 }}
                    />
                  </div>
                  <Button onClick={this.addExtraCharge} primary>
                    Añadir Cargo
                  </Button>
                </div>
                <Header as="h2">Notas Adicionales</Header>
                <Form>
                  <TextArea
                    name="additional_comments"
                    placeholder="Agrega comentarios sobre el pedido"
                    onChange={this.handleInputChange}
                  />
                </Form>
              </Segment>
            </Segment.Group>
            <Button
              type="submit"
              primary
              onClick={this.handleOnSumbitOrderClick}
              style={{ backgroundColor: "rgb(80, 135, 60)", color: "white" }}
              disabled={!this.isOrderComplete()}
            >
              Continuar
            </Button>
          </Grid.Column>
        </Grid>

        {/* Modal for scanning product */}
        <Modal
          onClose={() => this.setState({ scanningProduct: false })}
          open={scanningProduct}
          size="small"
        >
          <Modal.Header>Escanear Producto</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              <p>Escaneando producto...</p>
              {/* Placeholder for scanned product info */}
            </Modal.Description>

            <Button
              content="Confirmar"
              labelPosition="right"
              icon="checkmark"
              onClick={() => {
                this.handleScanProduct();
              }}
              positive
            />
          </Modal.Content>
          <Modal.Actions>
            <Button
              color="red"
              onClick={() => this.setState({ scanningProduct: false })}
            >
              Cancelar
            </Button>
            <Button
              content="Confirmar"
              labelPosition="right"
              icon="checkmark"
              onClick={() => {
                this.setState({ scanningProduct: false });
                alert("Producto escaneado confirmado");
              }}
              positive
            />
          </Modal.Actions>
        </Modal>

        <OrderSummaryModal
          open={this.state.showOrderReviewModal}
          onClose={() => this.setState({ showOrderReviewModal: false })}
          onSendClick={() => this.onSendOrderClick()}
          orderDetails={{ ...order, orderShippingDetails: orderShippingDetails }}
          discount={order.discount_percentage}
          onDiscountChange={(percentage) =>
            this.setState({
              order: { ...order, discount_percentage: percentage },
            })
          }
        />

        <DeliveryInfoModal
          open={this.state.isDeliveryInfoOpen}
          onClose={() => this.setState({ isDeliveryInfoOpen: false })}
          onContinueClick={() => this.setState({ isDeliveryInfoOpen: false, showOrderReviewModal: true })}
          onInputChange={this.handleDeliveryInputChange}
          orderShippingDetails={this.state.orderShippingDetails}
        />

        <BarcodeScanner onBarcodeScanned={(barcode) => this.findProductByBarcode(barcode)} />
      </Container>
    );
  }
}

OrderView.propTypes = {
  getPrices: PropTypes.func,
  getUsers: PropTypes.func,
  saveOrder: PropTypes.func,
  navigate: PropTypes.func,
  prices: PropTypes.array,
  userData: PropTypes.object,
};

const actions = {
  getPrices,
  saveOrder,
  getUsers
};

const mapStateToProps = (state) => ({
  prices: state.app.prices,
  userData: state.app.userData,
  users: state.app.users,
});

export default connect(mapStateToProps, actions)(withNavigate(OrderView));
