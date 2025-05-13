import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
  Button,
  Card,
  Icon,
  Table,
  Header,
  Segment,
  Label,
} from "semantic-ui-react";
import { Link } from "react-router-dom";
import formatter from "../../utils/formatter";
import { getUpcomingDeliveries } from "../../store/actions";

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      showDropdown: false,
    };
  }

  componentDidMount() {
    this.props.getUpcomingDeliveries();
  }

  getAddress(delivery) {
    return `${delivery.street} ${delivery.house_number}, ${
      (delivery.neighborhood, delivery.city)
    }`;
  }

  render() {
    const { userData } = this.props;
    const { date, time } = this.state;

    const quickActions = [
      {
        icon: "cart plus",
        color: "purple",
        text: "Nueva Venta",
        linkTo: "/sales",
      },
      { icon: "users", color: "red", text: "Clientes", linkTo: "/clients" },
      { icon: "box", color: "purple", text: "Productos", linkTo: "/prices" },
      {
        icon: "chart bar",
        color: "red",
        text: "Reportes de Caja",
        linkTo: "/cash-report",
      },
    ];

    return (
      <div
        style={{
          backgroundColor: "#f9f7f7",
          minHeight: "100vh",
          padding: "20px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "80px auto 0" }}>
          {/* Welcome Section */}
          <Segment style={{ marginBottom: "20px" }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <Header as="h2" style={{ margin: 0 }}>
                  Bienvenido/a
                  {userData
                    ? ", " + formatter.capitalize(userData.first_name)
                    : "!"}
                </Header>
                <div style={{ color: "#666" }}>
                  {date} | {time}
                </div>
              </div>

            </div>
          </Segment>

          {/* Statistics */}
          <Segment style={{ marginBottom: "20px" }}>
            <Header as="h3">
              <Icon name="chart line" /> Resumen del dia
            </Header>
            <Card.Group itemsPerRow={3}>
              <Card>
                <Card.Content>
                  <Card.Header>$1,284.56</Card.Header>
                  <Card.Meta>Ventas de hoy</Card.Meta>
                </Card.Content>
              </Card>
              <Card>
                <Card.Content>
                  <Card.Header>7</Card.Header>
                  <Card.Meta>Número de ventas</Card.Meta>
                </Card.Content>
              </Card>
              <Card>
                <Card.Content>
                  <Card.Header>10</Card.Header>
                  <Card.Meta>Envíos a domicilio</Card.Meta>
                </Card.Content>
              </Card>
            </Card.Group>
          </Segment>

          {/* Quick Actions */}
          <Segment>
            <Header as="h3" style={{ marginBottom: "20px" }}>
              <Icon name="lightbulb" /> Atajos
            </Header>
            <Card.Group itemsPerRow={4}>
              {quickActions.map((action, index) => (
                <Link
                  to={action.linkTo}
                  key={index}
                  style={{ textDecoration: "none" }}
                >
                  <Card
                    color={action.color}
                    raised
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <Card.Content>
                      <Icon name={action.icon} size="huge" />
                      <Card.Description>{action.text}</Card.Description>
                    </Card.Content>
                  </Card>
                </Link>
              ))}
            </Card.Group>
          </Segment>

          {/* Today's Deliveries */}
          <Segment>
            <Header as="h3">
              <Icon name="truck" /> Próximas entregas a domicilio
            </Header>
            <Table celled>
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell># Orden</Table.HeaderCell>
                  <Table.HeaderCell>Destinatario</Table.HeaderCell>
                  <Table.HeaderCell>Dirección</Table.HeaderCell>
                  <Table.HeaderCell>Hora de entrega</Table.HeaderCell>
                  {/* <Table.HeaderCell>Estado</Table.HeaderCell> */}
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {this.props.upcomingDeliveries &&
                this.props.upcomingDeliveries.length > 0 ? (
                  this.props.upcomingDeliveries.map((order) => (
                    <Table.Row key={order.order_id}>
                      <Table.Cell>{order.order_id}</Table.Cell>
                      <Table.Cell>{order.recipient_name}</Table.Cell>
                      <Table.Cell>{this.getAddress(order)}</Table.Cell>
                      <Table.Cell>{order.delivery_time_start}</Table.Cell>
                    </Table.Row>
                  ))
                ) : (
                  <Table.Row>
                    <Table.Cell colSpan="4" textAlign="center">
                      No hay entregas próximas para el resto del día.
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table>
          </Segment>

          {/* Schedule */}
          {/* <Segment>
            <Header as="h3">
              <Icon name="calendar" /> Próximos Eventos
            </Header>
            {scheduleItems.map((event, index) => (
              <Label key={index} color={event.color} style={{ margin: "5px" }}>
                <strong>{event.time}</strong> {event.text}
              </Label>
            ))}
          </Segment> */}
        </div>
      </div>
    );
  }
}

HomePage.propTypes = {
  userData: PropTypes.shape({
    first_name: PropTypes.string,
  }),
  getUpcomingDeliveries: PropTypes.func,
  upcomingDeliveries: PropTypes.array,
};

const mapStateToProps = (state) => ({
  userData: state.app.userData,
  upcomingDeliveries: state.app.upcomingDeliveries,
});

const actions = {
  getUpcomingDeliveries,
};

export default connect(mapStateToProps, actions)(HomePage);
