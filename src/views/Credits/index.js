import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Button,
  Container,
  Header,
} from "semantic-ui-react";
import { getOrders, getClients } from "../../store/actions";
import CustomTable from "../../components/CustomTable";
import { CONTAINERS_BORDER } from "../../utils/Colors";
import Name from "./cells/Name";
import Actions from "./cells/Actions";
import eventManager from "../../utils/eventManager";
import IdCell from "./cells/Id";
import Total from "./cells/Total";
import SaleType from "./cells/SaleType";
import { Link } from "react-router-dom";
import { ORDER_STATUS } from "../../utils/constants";
import OrderStatus from "../Dashboard/cells/Status";

const options = [
  { key: "m", text: "Flores", value: "Flores" },
  { key: "f", text: "Arreglo", value: "Arreglo" },
  { key: "o", text: "Plantas", value: "Plantas" },
];

class DashboardView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      productToDelete: null,
      confirmationModal: false,
      showAddProductModal: false,
      newProduct: { name: "", price: 0, category: "", stock: 0, description: "" },
    };
  }

  componentDidMount() {
    this.props.getOrders();
    this.props.getClients();

    this.callbackID = eventManager.on("order_saved", () => {
      this.props.getOrders();
    });
  }
  
  componentWillUnmount() {
    eventManager.unsubscribe("order_saved", this.callbackID);
  }

  onSaveClick() {
    const { newProduct } = this.state;

    this.props.saveProduct(newProduct);
  }

  onClickEdit() {
    console.log("EDITING!!");
  }

  getHeaders() {
    return [
      {
        label: "Folio",
        component: <IdCell />,
        style: { background: "#F9FAFB", width: 150 },
      },
      {
        label: "Nombre del Comprador",
        component: <Name clients={this.props.clients}/>,
        style: { background: "#F9FAFB", width: 150 },
      },
      {
        label: "Tipo de Pago",
        component: <SaleType />,
        style: { background: "#F9FAFB", width: 50 },
      },
      {
        label: "Estado",
        component: <OrderStatus />,
        style: { background: "#F9FAFB", width: 50 },
      },
      {
        label: "Total",
        component: <Total />,
        style: { background: "#F9FAFB", width: 50 },
      },
    //   {
    //     label: "",
    //     component: (
    //       <Actions
    //         onRemove={(data) =>
    //           this.setState({ confirmationModal: true, productToDelete: data })
    //         }
    //         onEdit={this.onClickEdit.bind(this)}
    //       />
    //     ),
    //     style: { background: "#F9FAFB", paddingTop: 0 },
    //   },
    ];
  }

  render() {
    const { orders } = this.props;

    return (
      <Container style={{ marginTop: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Header as="h1">Créditos</Header>
          <Link to="/sales">
            <Button
                content="Nueva Venta"
                style={{ backgroundColor: "rgb(80, 135, 60)", color: "white" }}
                onClick={() => this.setState({ showAddProductModal: true })}
            />
          </Link>
        </div>
        <CustomTable
          style={{
            border: CONTAINERS_BORDER,
            borderRadius: 10,
            overflow: "hidden",
          }}
          footerStyle={{ background: "#F9FAFB" }}
          orderDirection="ascending"
          headers={this.getHeaders()}
          data={orders.filter(ord => ord.status === "IN_DEBT" || ord.status === "PARTIALLY_PAID")}
        />
      </Container>
    );
  }
}

DashboardView.propTypes = {
  getOrders: PropTypes.func,
  orders: PropTypes.array,
  getClients: PropTypes.func,
  clients: PropTypes.array,
};

const actions = {
  getOrders,
  getClients
};

const mapStateToProps = (state) => ({
  orders: state.app.orders,
  clients: state.app.clients,
});

export default connect(mapStateToProps, actions)(DashboardView);
