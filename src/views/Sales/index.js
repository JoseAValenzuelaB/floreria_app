import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "./SalesView.css";
import { getPrices, saveOrder, getUsers } from "../../store/actions";
import BarcodeScanner from "../../components/BarcodeScanner";
import withNavigate from "../../components/NavigateWrapper";
import eventManager from "../../utils/eventManager";
import { Button } from "semantic-ui-react";
import { API_URL } from "../../utils/constants";
import { toast } from "react-toastify";

class SalesView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cart: [],
      searchTerm: "",
      barcode: "",
      paymentAmount: "",
      isDeliveryModalOpen: false,
      isConfirmModalOpen: false,
      extraCharge: "",
      deliveryInfo: {
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
    this.props.getPrices();
    this.props.getUsers();

    this.callbackID = eventManager.on("order_saved", (orderDetails) => {
      toast.success(`La orden se creó correctamente!!`);
      this.props.navigate("/submitted-orders");
    });
  }

  addToCart = (product) => {
    const { cart } = this.state;
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      this.setState({
        cart: cart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        ),
      });
    } else {
      this.setState({
        cart: [...cart, { ...product, quantity: 1 }],
      });
    }
  };

  findProductByBarcode(barcode) {
    const products = this.props.prices || [];
    const productFounded = products.find(
      (product) => String(product.id) === barcode
    );
    this.addToCart(productFounded);
  }

  removeFromCart = (productId) => {
    const { cart } = this.state;
    this.setState({
      cart: cart
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 0 }
            : item
        )
        .filter((item) => item.quantity > 0),
    });
  };

  handleDeliveryInfoChange = (e) => {
    const { name, value, type, checked } = e.target;
    this.setState((prevState) => ({
      deliveryInfo: {
        ...prevState.deliveryInfo,
        [name]: type === "checkbox" ? checked : value,
      },
    }));
  };

  getCashier(id) {
    const { users } = this.props;

    if (!users.length) {
      return id;
    }
    const cashier = users.filter((user) => user.id === id)[0];

    return cashier.first_name;
  }

  getDeliveryType(deliveryInfo) {
    const requiredFields = [
      "recipient_name",
      "delivery_date",
      "delivery_time_start",
    ];

    const requiredFieldsFilled = requiredFields.every((field) => {
      // Ensure the value is a string and then trim it
      return (
        typeof deliveryInfo[field] === "string" &&
        deliveryInfo[field].trim() !== ""
      );
    });

    // Check if there are other fields filled besides the required ones
    const otherFieldsFilled = Object.keys(deliveryInfo)
      .filter((field) => !requiredFields.includes(field))
      .some((field) => {
        // Ensure the value is a string and then trim it
        return (
          typeof deliveryInfo[field] === "string" &&
          deliveryInfo[field].trim() !== ""
        );
      });

    // Determine the return value based on the conditions
    if (requiredFieldsFilled && !otherFieldsFilled) {
      return "STORE_PICKUP";
    } else if (requiredFieldsFilled && otherFieldsFilled) {
      return "HOME_DELIVERY";
    } else {
      return "DIRECT_DELIVERY";
    }
  }

  onSendOrderClick() {
    const { deliveryInfo, cart, paymentAmount } = this.state;

    const newOrder = {
      buyer_name: "",
      products: cart,
      attended_by: this.getCashier(this.props.userData.id),
      delivery_type: this.getDeliveryType(deliveryInfo),
      status: "SUBMITTED",
      additional_comments: "",
      total: cart
        .reduce((sum, item) => sum + item.amount * item.quantity, 0)
        .toFixed(2),
      shipping_info: deliveryInfo,
      cashier: this.getCashier(this.props.userData.id),
    };
    this.props.saveOrder(newOrder);
  }

  addExtraCharge = () => {
    const { extraCharge } = this.state;
    const chargeAmount = parseFloat(extraCharge);

    if (!isNaN(chargeAmount) && chargeAmount > 0) {
      const newProduct = {
        id: 1,
        description: "Cargo extra",
        amount: chargeAmount,
        image:
          "https://jamescressflorist.com/cdn/shop/articles/IMG_0937.jpg?v=1696382113",
      };

      this.addToCart(newProduct);
      this.setState({ extraCharge: "" });
    }
  };

  renderDeliverySummary() {

    const type = this.getDeliveryType(this.state.deliveryInfo);
    const {
      street,
      house_number,
      neighborhood,
      city,
      delivery_date,
      delivery_time_start,
      delivery_time_end,
    } = this.state.deliveryInfo;

    switch (type) {
      case "HOME_DELIVERY":
        return (
          <p>
            ¿Desea finalizar la venta con envío a la dirección proporcionada?{" "}
            <br />
            <strong>
              {`${street} ${house_number}, ${neighborhood}, ${city}`} <br />
              Fecha: {delivery_date} <br />
              Hora estimada de entrega: {delivery_time_start} -{" "}
              {delivery_time_end}
            </strong>
          </p>
        );
      case "STORE_PICKUP":
        return (
          <p>
            ¿Desea finalizar la venta con recolección en tienda? <br />
            <strong>
              Fecha de recolección: {delivery_date} <br />
              Hora: {delivery_time_start} - {delivery_time_end}
            </strong>
          </p>
        );
      case "DIRECT_DELIVERY":
        return (
          <p>
            ¿Desea finalizar la venta sin agregar información de envío? <br />
            {/* <strong>
              El repartidor recibirá las instrucciones y detalles directamente
              del cliente.
            </strong> */}
          </p>
        );
      default:
        return <p>No se ha seleccionado un tipo de entrega.</p>;
    }
  }

  render() {
    const {
      cart,
      searchTerm,
      isDeliveryModalOpen,
      isConfirmModalOpen,
      deliveryInfo,
    } = this.state;
    const { prices } = this.props;

    const filteredProducts = (prices || []).filter((product) =>
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const total = cart.reduce(
      (sum, item) => sum + item.amount * item.quantity,
      0
    );

    return (
      <div className="pos-container">
        <div className="pos-content">
          <div className="scrollable-content" style={{ marginTop: 50 }}>
            <section className="product-section">
              <div className="panel">
                <h2 className="heading">Productos</h2>
                <div className="input-group">
                  <input
                    type="text"
                    className="input"
                    placeholder="Buscar productos..."
                    value={searchTerm}
                    onChange={(e) =>
                      this.setState({ searchTerm: e.target.value })
                    }
                  />
                </div>
                <div className="product-grid">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="product-card"
                      onClick={() => this.addToCart(product)}
                    >
                      <img
                        src={
                          `${API_URL}${product.image}` ||
                          "https://react.semantic-ui.com/images/wireframe/image.png"
                        }
                        alt={product.description}
                        className="product-image"
                      />
                      <div className="product-info">
                        <h3>{product.description}</h3>
                        <p>${product.amount.toFixed(2)}</p>
                        {/* <button
                          onClick={() => this.addToCart(product)}
                          className="button"
                        >
                          Agregar
                        </button> */}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            <section className="cart-section">
              <div className="panel">
                <h2 className="heading">Resumen</h2>
                {cart.map((item) => (
                  <div key={item.id} className="cart-item">
                    <div>
                      <h3>{item.description}</h3>
                      <p>
                        ${item.amount.toFixed(2)} x {item.quantity}
                      </p>
                    </div>
                    <div>
                      <button
                        onClick={() => this.removeFromCart(item.id)}
                        className="button"
                      >
                        -
                      </button>
                      <span style={{ margin: "0 0.5rem" }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => this.addToCart(item)}
                        className="button"
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
                <div className="total">Total: ${total.toFixed(2)}</div>
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
                      value={this.state.extraCharge}
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
              </div>
            </section>
          </div>
        </div>
        <section className="payment-section">
          <div className="payment-form">
            <button
              onClick={() => this.setState({ isDeliveryModalOpen: true })}
              className="button-payment"
            >
              Información de Envío
            </button>
            <button
              onClick={() => this.setState({ isConfirmModalOpen: true })}
              // onClick={() => this.onSendOrderClick()}
              className="button-payment-pagar"
            >
              Pagar
            </button>
          </div>
        </section>
        {isDeliveryModalOpen && (
          <div className="modal-backdrop">
            <div className="modal">
              <div className="modal-header">
                <h2 className="heading">Información de Envío</h2>
                <div style={{ display: "flex" }}>
                  <input
                    type="checkbox"
                    id="pickup_in_store"
                    name="pickup_in_store"
                    checked={deliveryInfo.pickup_in_store}
                    onChange={this.handleDeliveryInfoChange}
                    style={{ marginRight: 10 }}
                  />
                  <label htmlFor="pickup_in_store">Recoger en tienda</label>
                </div>
              </div>
              <form>
                <div className="form-group">
                  <div className="input-group">
                    <label htmlFor="recipient_name">
                      Nombre del destinatario:
                    </label>
                    <input
                      type="text"
                      id="recipient_name"
                      name="recipient_name"
                      value={deliveryInfo.recipient_name}
                      onChange={this.handleDeliveryInfoChange}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="delivery_date">Fecha de entrega:</label>
                    <input
                      type="date"
                      id="delivery_date"
                      name="delivery_date"
                      value={deliveryInfo.delivery_date}
                      onChange={this.handleDeliveryInfoChange}
                      required
                    />
                  </div>
                </div>
                <label htmlFor="delivery_time_start">
                  Rango de tiempo para la entrega:
                </label>
                <div className="form-group">
                  <div
                    className="input-group"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <input
                      type="time"
                      id="delivery_time_start"
                      name="delivery_time_start"
                      value={deliveryInfo.delivery_time_start}
                      onChange={this.handleDeliveryInfoChange}
                      required
                      style={{ marginRight: "5px" }}
                      aria-label="Hora de inicio"
                    />
                    <span style={{ margin: "0 5px" }}>a</span>
                    <input
                      type="time"
                      id="delivery_time_end"
                      name="delivery_time_end"
                      value={deliveryInfo.delivery_time_end}
                      onChange={this.handleDeliveryInfoChange}
                      required
                      style={{ marginLeft: "5px" }}
                      aria-label="Hora de fin"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="input-group">
                    <label htmlFor="street">Calle:</label>
                    <input
                      type="text"
                      id="street"
                      name="street"
                      value={deliveryInfo.street}
                      onChange={this.handleDeliveryInfoChange}
                      required
                      disabled={deliveryInfo.pickup_in_store}
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="postal_code">Código Postal:</label>
                    <input
                      type="text"
                      id="postal_code"
                      name="postal_code"
                      value={deliveryInfo.postal_code}
                      onChange={this.handleDeliveryInfoChange}
                      required
                      disabled={deliveryInfo.pickup_in_store}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <div className="input-group">
                    <label htmlFor="neighborhood">Colonia:</label>
                    <input
                      type="text"
                      id="neighborhood"
                      name="neighborhood"
                      value={deliveryInfo.neighborhood}
                      onChange={this.handleDeliveryInfoChange}
                      required
                      disabled={deliveryInfo.pickup_in_store}
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="house_number">Número de casa:</label>
                    <input
                      type="text"
                      id="house_number"
                      name="house_number"
                      value={deliveryInfo.house_number}
                      onChange={this.handleDeliveryInfoChange}
                      required
                      disabled={deliveryInfo.pickup_in_store}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <div className="input-group">
                    <label htmlFor="city">Ciudad:</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={deliveryInfo.city}
                      onChange={this.handleDeliveryInfoChange}
                      required
                      disabled={deliveryInfo.pickup_in_store}
                    />
                  </div>
                  <div className="input-group">
                    <label htmlFor="contact_number">Número de contacto:</label>
                    <input
                      type="tel"
                      id="contact_number"
                      name="contact_number"
                      value={deliveryInfo.contact_number}
                      onChange={this.handleDeliveryInfoChange}
                      required
                      disabled={deliveryInfo.pickup_in_store}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <div className="input-group" style={{ width: "100%" }}>
                    <label htmlFor="delivery_instructions">
                      Instrucciones de entrega:
                    </label>
                    <textarea
                      id="delivery_instructions"
                      name="delivery_instructions"
                      value={deliveryInfo.delivery_instructions}
                      onChange={this.handleDeliveryInfoChange}
                      disabled={deliveryInfo.pickup_in_store}
                    ></textarea>
                  </div>
                </div>
                <div className="button-group">
                  <button
                    type="button"
                    className="button"
                    onClick={() =>
                      this.setState({
                        isDeliveryModalOpen: false,
                        deliveryInfo: {
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
                      })
                    }
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    className="button"
                    onClick={() => {
                      this.setState({ isDeliveryModalOpen: false });
                    }}
                  >
                    Guardar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {isConfirmModalOpen && (
          <div className="modal-backdrop">
            <div className="modal">
              <div className="modal-header">
                <h2 className="heading">
                  Agregar información de envío o Finalizar venta
                </h2>
              </div>
              <form>
                <div className="form-group">
                  {this.renderDeliverySummary()}
                </div>
                <div className="button-group">
                  <button
                    type="button"
                    className="button"
                    onClick={() =>
                      this.setState({
                        isConfirmModalOpen: false,
                        isDeliveryModalOpen: true,
                      })
                    }
                  >
                    Agregar Información de Envío
                  </button>
                  <button
                    type="button"
                    className="button"
                    onClick={() => {
                      // Handle the sale confirmation
                      this.setState({ isConfirmModalOpen: false });
                      this.onSendOrderClick();
                      // Proceed with the sale process (e.g., API call, etc.)
                    }}
                  >
                    Finalizar Venta
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <BarcodeScanner
          onBarcodeScanned={(barcode) => this.findProductByBarcode(barcode)}
        />
      </div>
    );
  }
}

SalesView.propTypes = {
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
  getUsers,
};

const mapStateToProps = (state) => ({
  prices: state.app.prices,
  userData: state.app.userData,
  users: state.app.users,
});

export default connect(mapStateToProps, actions)(withNavigate(SalesView));
