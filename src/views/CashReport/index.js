import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Button,
  Table,
  Header,
  Segment,
  Grid,
  Icon,
  Statistic,
  Card,
  Divider,
  Dimmer,
  Loader,
} from "semantic-ui-react";
import * as XLSX from "xlsx";
import { getCashReport, getClients } from "../../store/actions";
import { PAYMENT_TYPE_DICT } from "../../utils/constants";
import withNavigate from "../../components/NavigateWrapper";

class ReporteCierreCaja extends Component {
  componentDidMount() {
    this.props.getClients();
    this.props.getCashReport({
      start_hour: 0,
      start_minute: 0,
      end_hour: 23,
      end_minute: 59,
      cashier_id: this.props.userData.id
    });
  }

  onValidatePasswordClick() {
    this.props.validatePassword({
      username: this.props.userData.email,
      password: formData.Data.password,
    });
  }

  getClientFullName(clientId) {
    const client = this.props.clients.find((client) => client.id === clientId);
    if (client) {
      return `${client.name} ${client.last_name}`;
    } else {
      return `-`;
    }
  }

  downloadExcel = () => {
    const { cashReport } = this.props;

    if (!cashReport) {
      console.error("No data available to generate report.");
      return;
    }

    // Create data for each section
    const summaryData = [
      {
        Concepto: "Ventas Totales",
        Monto: cashReport.total_sales?.toFixed(2) || "0.00",
      },
      {
        Concepto: "Transacciones Totales",
        Monto: cashReport.total_transactions || 0,
      },
      {
        Concepto: "Promedio por Transacción",
        Monto: (
          cashReport.total_sales / cashReport.total_transactions || 0
        ).toFixed(2),
      },
      {
        Concepto: "Efectivo",
        Monto: cashReport.payment_summary?.CASH?.toFixed(2) || "0.00",
      },
      {
        Concepto: "Tarjeta",
        Monto: cashReport.payment_summary?.CARD?.toFixed(2) || "0.00",
      },
      {
        Concepto: "Transferencia",
        Monto: cashReport.payment_summary?.TRANSFER?.toFixed(2) || "0.00",
      },
      {
        Concepto: "Otros",
        Monto: cashReport.payment_summary?.OTHER?.toFixed(2) || "0.00",
      },
      {
        Concepto: "Total Retiro",
        Monto: cashReport.total_withdrawals?.toFixed(2) || "0.00",
      },
      {
        Concepto: "Apertura",
        Monto: cashReport.opening_cash?.toFixed(2) || "0.00",
      },
      {
        Concepto: "Esperado en Caja",
        Monto: cashReport.expected_cash?.toFixed(2) || "0.00",
      },
    ];

    const salesData = (cashReport.sales || []).map((sale) => ({
      ID: sale.id,
      Total: sale.total.toFixed(2),
      "Tipo de Pago": sale.payment_type,
      Fecha: new Date(sale.created_at).toLocaleString(),
    }));

    const withdrawalsData = (cashReport.withdrawals || []).map(
      (withdrawal) => ({
        ID: withdrawal.id,
        Monto: withdrawal.amount.toFixed(2),
        Concepto: withdrawal.concept,
        Fecha: new Date(withdrawal.created_at).toLocaleString(),
      })
    );

    // Combine data into a single array for the sheet
    const combinedData = [
      ["Resumen"],
      ["Concepto", "Monto"],
      ...summaryData.map((item) => [item.Concepto, item.Monto]),
      [],
      ["Ventas"],
      ["ID", "Total", "Tipo de Pago", "Fecha"],
      ...salesData.map((sale) => [
        sale.ID,
        sale.Total,
        sale["Tipo de Pago"],
        sale.Fecha,
      ]),
      [],
      ["Retiros"],
      ["ID", "Monto", "Concepto", "Fecha"],
      ...withdrawalsData.map((withdrawal) => [
        withdrawal.ID,
        withdrawal.Monto,
        withdrawal.Concepto,
        withdrawal.Fecha,
      ]),
    ];

    try {
      // Create a new workbook and worksheet
      const wb = XLSX.utils.book_new();
      const ws = XLSX.utils.aoa_to_sheet(combinedData);

      // Apply styling to headers (example)
      ws["A1"].s = {
        font: { bold: true, sz: 14 },
        alignment: { horizontal: "center" },
      };
      ws["A2"].s = {
        font: { bold: true, sz: 12 },
        fill: { fgColor: { rgb: "FFFF00" } },
      }; // Yellow background for headers

      // Apply borders to all cells
      const range = XLSX.utils.decode_range(ws["!ref"]);
      for (let row = range.s.r; row <= range.e.r; row++) {
        for (let col = range.s.c; col <= range.e.c; col++) {
          const cell_ref = XLSX.utils.encode_cell({ r: row, c: col });
          if (!ws[cell_ref]) continue;
          ws[cell_ref].s = ws[cell_ref].s || {};
          ws[cell_ref].s.border = {
            top: { style: "thin" },
            bottom: { style: "thin" },
            left: { style: "thin" },
            right: { style: "thin" },
          };
        }
      }

      // Adjust column widths
      ws["!cols"] = [{ wch: 30 }, { wch: 20 }]; // Adjust column widths

      // Append worksheet to workbook
      XLSX.utils.book_append_sheet(wb, ws, "Reporte Completo");

      // Generate and download the Excel file
      XLSX.writeFile(wb, "ReporteCierreCaja.xlsx");
    } catch (error) {
      console.error("Error generating Excel file:", error);
    }
  };

  logout() {
    window.localStorage.removeItem("session");
    window.localStorage.removeItem("role");
    this.props.navigate("/login");
  }

  render() {
    const { loadings, cashReport } = this.props;
    const fechaActual = new Date().toLocaleString("es-ES", {
      timeZone: "America/Mexico_City",
    });

    return (
      <Segment padded="very">
        {loadings.cashReport ? (
          <Dimmer active inverted>
            <Loader>Loading...</Loader>
          </Dimmer>
        ) : (
          <>
            <Grid columns={2} stackable>
              <Grid.Column>
                <Header as="h1">
                  <Icon name="money bill alternate outline" />
                  <Header.Content>
                    Reporte de Cierre de Caja
                    <Header.Subheader>{fechaActual}</Header.Subheader>
                  </Header.Content>
                </Header>
              </Grid.Column>
              <Grid.Column textAlign="right">
                <div style={{ display: "flex", justifyContent: "flex-end" }}>
                  <Button
                    primary
                    size="large"
                    onClick={this.downloadExcel}
                    icon
                    labelPosition="left"
                    aria-label="Descargar Excel"
                  >
                    <Icon name="download" />
                    Descargar Excel
                  </Button>

                  <Button
                    negative
                    size="large"
                    onClick={() => this.logout()}
                    icon
                    labelPosition="left"
                  >
                    <Icon name="close" />
                    Finalizar
                  </Button>
                </div>
              </Grid.Column>
            </Grid>

            <Divider />

            <Grid columns={3} stackable>
              <Grid.Column>
                <Card fluid>
                  <Card.Content>
                    <Card.Header>Ventas Totales</Card.Header>
                    <Card.Description>
                      <Statistic size="small">
                        <Statistic.Value>
                          ${cashReport.total_sales?.toFixed(2) || "0.00"}
                        </Statistic.Value>
                      </Statistic>
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
              <Grid.Column>
                <Card fluid>
                  <Card.Content>
                    <Card.Header>Transacciones Totales</Card.Header>
                    <Card.Description>
                      <Statistic size="small">
                        <Statistic.Value>
                          {cashReport.total_transactions || 0}
                        </Statistic.Value>
                      </Statistic>
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
              <Grid.Column>
                <Card fluid>
                  <Card.Content>
                    <Card.Header>Promedio por Transacción</Card.Header>
                    <Card.Description>
                      <Statistic size="small">
                        <Statistic.Value>
                          {cashReport.total_sales &&
                          cashReport.total_transactions
                            ? `$${(
                                cashReport.total_sales /
                                cashReport.total_transactions
                              ).toFixed(2)}`
                            : "No disponible"}
                        </Statistic.Value>
                      </Statistic>
                    </Card.Description>
                  </Card.Content>
                </Card>
              </Grid.Column>
            </Grid>

            <Divider />

            <Table celled selectable size="large">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>Concepto</Table.HeaderCell>
                  <Table.HeaderCell>Monto</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Efectivo</Table.Cell>
                  <Table.Cell>
                    {cashReport.payment_summary?.CASH?.toFixed(2) || "$0.00"}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Tarjeta</Table.Cell>
                  <Table.Cell>
                    {cashReport.payment_summary?.CARD?.toFixed(2) || "$0.00"}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Transferencia</Table.Cell>
                  <Table.Cell>
                    {cashReport.payment_summary?.TRANSFER?.toFixed(2) ||
                      "$0.00"}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Otros</Table.Cell>
                  <Table.Cell>
                    {cashReport.payment_summary?.OTHER?.toFixed(2) || "$0.00"}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Total Retiro</Table.Cell>
                  <Table.Cell>
                    {cashReport.total_withdrawals?.toFixed(2) || "$0.00"}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Total Cambio Entregado</Table.Cell>
                  <Table.Cell>
                    {cashReport.total_change?.toFixed(2) || "$0.00"}
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Apertura</Table.Cell>
                  <Table.Cell>
                    {cashReport.opening_cash?.toFixed(2) || "$0.00"}
                  </Table.Cell>
                </Table.Row>
                {/* <Table.Row>
                  <Table.Cell>Esperado en Caja</Table.Cell>
                  <Table.Cell>
                    {cashReport.expected_cash?.toFixed(2) || "$0.00"}
                  </Table.Cell>
                </Table.Row> */}
              </Table.Body>
              <Table.Footer>
                <Table.Row>
                  <Table.HeaderCell>
                    <Header as="h4">
                      <Icon name="calculator" />
                      <Header.Content>Esperado en Caja</Header.Content>
                    </Header>
                  </Table.HeaderCell>
                  <Table.HeaderCell>
                    <Header as="h3">
                      ${cashReport.expected_cash?.toFixed(2) || "0.00"}
                    </Header>
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Footer>
            </Table>

            <Divider />

            <Header as="h3">Ventas</Header>
            <Table celled selectable size="large">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>ID</Table.HeaderCell>
                  <Table.HeaderCell>Total</Table.HeaderCell>
                  <Table.HeaderCell>Tipo de Pago</Table.HeaderCell>
                  <Table.HeaderCell>Fecha</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {(cashReport.sales || []).map((sale) => (
                  <Table.Row key={sale.id}>
                    <Table.Cell>{sale.id}</Table.Cell>
                    <Table.Cell>${sale.total.toFixed(2)}</Table.Cell>
                    <Table.Cell>{PAYMENT_TYPE_DICT[sale.payment_type]}</Table.Cell>
                    <Table.Cell>
                      {new Date(sale.created_at).toLocaleString()}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>

            <Divider />

            <Header as="h3">Créditos</Header>
            <Table celled selectable size="large">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>ID</Table.HeaderCell>
                  <Table.HeaderCell>Total</Table.HeaderCell>
                  <Table.HeaderCell>Cliente</Table.HeaderCell>
                  <Table.HeaderCell>Fecha</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {(cashReport.credits || []).map((sale) => (
                  <React.Fragment key={sale.id}>
                    {/* Row for the credit itself */}
                    <Table.Row>
                      <Table.Cell>{sale.id}</Table.Cell>
                      <Table.Cell>${sale.total.toFixed(2)}</Table.Cell>
                      <Table.Cell>
                        {this.getClientFullName(sale.client_id)}
                      </Table.Cell>
                      <Table.Cell>
                        {new Date(sale.created_at).toLocaleString()}
                      </Table.Cell>
                    </Table.Row>

                    {/* Conditionally render payment summary if sale_notes exists */}
                    {sale.sale_notes && sale.sale_notes.length > 0 && (
                      <Table.Row>
                        <Table.Cell colSpan="4">
                          <Header as="h4">Abonos</Header>
                          <Table celled size="small">
                            <Table.Header>
                              <Table.Row>
                                <Table.HeaderCell>Monto</Table.HeaderCell>
                                <Table.HeaderCell>
                                  Fecha de Pago
                                </Table.HeaderCell>
                                <Table.HeaderCell>
                                  Método de Pago
                                </Table.HeaderCell>
                              </Table.Row>
                            </Table.Header>
                            <Table.Body>
                              {sale.sale_notes.map((payment) => (
                                <Table.Row key={payment.id}>
                                  <Table.Cell>
                                    ${payment.total.toFixed(2)}
                                  </Table.Cell>
                                  <Table.Cell>
                                    {new Date(
                                      payment.created_at
                                    ).toLocaleString()}
                                  </Table.Cell>
                                  <Table.Cell>
                                    {PAYMENT_TYPE_DICT[payment.payment_type]}
                                  </Table.Cell>
                                </Table.Row>
                              ))}
                            </Table.Body>
                          </Table>
                        </Table.Cell>
                      </Table.Row>
                    )}
                  </React.Fragment>
                ))}
              </Table.Body>
            </Table>

            <Divider />

            <Header as="h3">Retiros</Header>
            <Table celled selectable size="large">
              <Table.Header>
                <Table.Row>
                  <Table.HeaderCell>ID</Table.HeaderCell>
                  <Table.HeaderCell>Monto</Table.HeaderCell>
                  <Table.HeaderCell>Concepto</Table.HeaderCell>
                  <Table.HeaderCell>Fecha</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {(cashReport.withdrawals || []).map((withdrawal) => (
                  <Table.Row key={withdrawal.id}>
                    <Table.Cell>{withdrawal.id}</Table.Cell>
                    <Table.Cell>${withdrawal.amount.toFixed(2)}</Table.Cell>
                    <Table.Cell>{withdrawal.concept}</Table.Cell>
                    <Table.Cell>
                      {new Date(withdrawal.created_at).toLocaleString()}
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </>
        )}
      </Segment>
    );
  }
}

ReporteCierreCaja.propTypes = {
  getCashReport: PropTypes.func.isRequired,
  navigate: PropTypes.func,
  cashReport: PropTypes.object.isRequired,
  userData: PropTypes.object.isRequired,
  getClients: PropTypes.func.isRequired,
  clients: PropTypes.array.isRequired,
  loadings: PropTypes.object.isRequired,
};

const actions = {
  getCashReport,
  getClients,
};

const mapStateToProps = (state) => ({
  cashReport: state.app.cashReport,
  userData: state.app.userData,
  clients: state.app.clients,
  loadings: state.app.loadings,
});

export default connect(mapStateToProps, actions)(withNavigate(ReporteCierreCaja));
