import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Container,
  Header,
} from "semantic-ui-react";
import { getOrders } from "../../store/actions";
import CustomTable from "../../components/CustomTable";
import { CONTAINERS_BORDER } from "../../utils/Colors";
import Name from "./cells/Name";
import eventManager from "../../utils/eventManager";
import IdCell from "./cells/Id";
import Total from "./cells/Total";
import SaleType from "./cells/SaleType";
import OrderStatus from "./cells/Status";
import { toast } from "react-toastify";


const options = [
  { key: "m", text: "Flores", value: "Flores" },
  { key: "f", text: "Arreglo", value: "Arreglo" },
  { key: "o", text: "Plantas", value: "Plantas" },
];

class DashboardView extends Component {
  componentDidMount() {
    this.props.getOrders();

    this.callbackID = eventManager.on("order_saved", () => {
      this.props.getOrders();
    });
  }
  
  componentWillUnmount() {
    eventManager.unsubscribe("order_saved", this.callbackID);
  }

  getHeaders() {
    return [
      {
        label: "Folio",
        component: <IdCell />,
        style: { background: "#F9FAFB", width: 150 },
      },
      // {
      //   label: "Nombre del Comprador",
      //   component: <Name />,
      //   style: { background: "#F9FAFB", width: 150 },
      // },
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
    ];
  }

  render() {
    const { orders } = this.props;

    return (
      <Container style={{ marginTop: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Header as="h1">Dashboard</Header>
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
          data={orders.filter(ord => ord.status !== "IN_DEBT" || ord.status !== "PARTIALLY_PAID")}
        />
      </Container>
    );
  }
}

DashboardView.propTypes = {
  getOrders: PropTypes.func,
  orders: PropTypes.array,
};

const actions = {
  getOrders,
};

const mapStateToProps = (state) => ({
  orders: state.app.orders,
});

export default connect(mapStateToProps, actions)(DashboardView);
