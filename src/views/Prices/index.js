import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Button,
  Container,
  Header,
  Modal,
  Form,
  Input,
} from "semantic-ui-react";
import {
  getPrices,
  savePrice,
  updatePriceByID,
  deletePriceByID,
} from "../../store/actions";
import CustomTable from "../../components/CustomTable";
import { CONTAINERS_BORDER } from "../../utils/Colors";
import Actions from "./cells/Actions";
import Price from "./cells/Price";
import Description from "./cells/Description";
import eventManager from "../../utils/eventManager";
import ImageUpload from "../../components/ImageUpload";
import { API_URL } from "../../utils/constants";
import JsBarcode from "jsbarcode";


class PricesView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prices: [],
      priceToDelete: null,
      confirmationModal: false,
      showAddPriceModal: false,
      showImageUploadModal: false,
      newPrice: {
        amount: 0,
        description: "",
        image: "",
      },
      priceToEdit: null,
      barcodeConfigModal: false,
      barcodeItem: null,
      barcodeQuantity: 1,
      showBarcodeModal: false,
      barcodeToGenerate: null,
      barcodeCopies: 1,
    };
  }

  componentDidMount() {
    this.props.getPrices();

    this.callbackID = eventManager.on("price_saved", () => {
      this.props.getPrices();
      this.setState({
        newPrice: {
          amount: 0,
          description: "",
          image: "",
        },
      });
    });

    this.callbackDeletePriceID = eventManager.on("price_deleted", () => {
      this.props.getPrices();
      this.setState({
        newPrice: { priceToDelete: null },
      });
    });
  }

  componentWillUnmount() {
    eventManager.unsubscribe("price_saved", this.callbackID);
    eventManager.unsubscribe("price_deleted", this.callbackDeletePriceID);
  }

  onSaveClick = () => {
    const { newPrice, priceToEdit } = this.state;
    if (priceToEdit) {
      this.props.updatePriceByID({
        id: priceToEdit.id,
        newValues: newPrice,
      });
    } else {
      this.props.savePrice(newPrice);
    }

    this.setState({
      showAddPriceModal: false,
      newPrice: {
        amount: 0,
        description: "",
        image: "",
      },
      priceToEdit: null,
    });
  };

  onEditClick = (price) => {
    this.setState({
      showAddPriceModal: true,
      newPrice: { ...price },
      priceToEdit: price,
    });
  };

  handleImageUpload = (image) => {
    this.setState((prevState) => ({
      newPrice: {
        ...prevState.newPrice,
        image,
      },
    }));
  };

  onGenerateBarcode = (item) => {
    this.setState({
      barcodeConfigModal: true,
      barcodeItem: item,
      barcodeQuantity: 1,
    });
  };

  handlePrintBarcode = () => {
    const { barcodeItem, barcodeQuantity } = this.state;
    const barcodeWindow = window.open("", "_blank");

    const content = Array(barcodeQuantity)
      .fill(
        `
        <div style="display: inline-block; margin: 10px; text-align: center;">
          <div>${barcodeItem.description}</div>
          <img src="${API_URL}${barcodeItem.image}" style="height: 100px;" />
          <div>$${barcodeItem.amount}</div>
        </div>
      `
      )
      .join("");

    barcodeWindow.document.write(`
      <html>
        <head>
          <title>Códigos de Barra</title>
          <style>
            body {
              padding: 20px;
              font-family: sans-serif;
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
            }
          </style>
        </head>
        <body>
          ${content}
          <script>
            setTimeout(() => {
              window.print();
            }, 500);
          </script>
        </body>
      </html>
    `);

    barcodeWindow.document.close();
    this.setState({ barcodeConfigModal: false });
  };

  getHeaders() {
    return [
      {
        label: "Descripción",
        component: <Description />,
        style: { background: "#F9FAFB", width: 500 },
      },
      {
        label: "Monto",
        component: <Price />,
        style: { background: "#F9FAFB", width: 150 },
      },
      {
        label: "",
        component: (
          <Actions
            onRemove={(data) =>
              this.setState({ confirmationModal: true, priceToDelete: data })
            }
            onEdit={(data) => this.onEditClick(data)}
            onGenerateBarcode={(data) => this.onGenerateBarcode(data)}
            onBarcodePreview={(data) => this.openBarcodeModal(data)} // 👈 Add this line
          />
        ),
        style: { background: "#F9FAFB", paddingTop: 0 },
      },
    ];
  }

  openBarcodeModal = (priceData) => {
    this.setState({
      showBarcodeModal: true,
      barcodeToGenerate: priceData,
      barcodeCopies: 1,
    });
  };

  generateAndPreviewBarcode = () => {
    const { barcodeCopies, barcodeToGenerate } = this.state;

    // Generate multiple barcode images
    const barcodesHTML = Array.from({ length: barcodeCopies }).map(() => {
      const canvas = document.createElement("canvas");
      JsBarcode(canvas, barcodeToGenerate.id.toString(), {
        format: "CODE128",
        displayValue: true,
        text: `$${barcodeToGenerate.amount}`,
        width: 4,
      });
      const imgSrc = canvas.toDataURL("image/png");
      return `<img src="${imgSrc}" style="margin:10px;" />`;
    });

    const previewWindow = window.open("", "_blank");
    const htmlContent = `
      <html>
        <head><title>Preview Barcodes</title></head>
        <body style="display:flex;flex-wrap:wrap;">
          ${barcodesHTML.join("")}
          <script type="text/javascript">
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            }
          </script>
        </body>
      </html>
    `;
    previewWindow.document.write(htmlContent);

    // window.electronAPI.printBarCode(htmlContent);

    this.setState({ showBarcodeModal: false });
  };

  render() {
    const {
      showAddPriceModal,
      newPrice,
      priceToEdit,
      showImageUploadModal,
      barcodeConfigModal,
      barcodeQuantity,
    } = this.state;
    const { prices } = this.props;

    return (
      <Container style={{ marginTop: "0px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Header as="h1">Gestión de Precios y Código de Barra</Header>
          <Button
            content="Agregar Precio"
            style={{ backgroundColor: "rgb(80, 135, 60)", color: "white" }}
            onClick={() => this.setState({ showAddPriceModal: true })}
          />
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
          data={prices || []}
        />

        {/* Add/Edit Modal */}
        <Modal
          onClose={() =>
            this.setState({ showAddPriceModal: false, priceToEdit: null })
          }
          open={showAddPriceModal}
          size="small"
        >
          <Modal.Header>
            {priceToEdit ? "Editar Precio" : "Agregar Nuevo Precio"}
          </Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Group widths="equal">
                <Form.Input
                  fluid
                  label="Monto"
                  placeholder="Monto del precio"
                  value={newPrice.amount}
                  onChange={(e) =>
                    this.setState({
                      newPrice: {
                        ...newPrice,
                        amount: Number(e.target.value),
                      },
                    })
                  }
                />
              </Form.Group>
              <Form.Group widths="equal">
                <Form.TextArea
                  fluid
                  label="Descripción"
                  placeholder="Descripción del precio"
                  value={newPrice.description}
                  onChange={(e) =>
                    this.setState({
                      newPrice: {
                        ...newPrice,
                        description: e.target.value,
                      },
                    })
                  }
                />
              </Form.Group>

              <Button
                onClick={() => this.setState({ showImageUploadModal: true })}
                content="Subir Imagen"
                color="blue"
              />
              {newPrice.image && (
                <img
                  src={`${API_URL}${newPrice.image}`}
                  alt="Preview"
                  style={{ marginTop: "10px", maxWidth: "100px" }}
                />
              )}
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button
              color="red"
              onClick={() =>
                this.setState({
                  showAddPriceModal: false,
                  priceToEdit: null,
                })
              }
            >
              Cancelar
            </Button>
            <Button
              content={priceToEdit ? "Guardar" : "Agregar"}
              labelPosition="right"
              icon="checkmark"
              onClick={this.onSaveClick}
              positive
            />
          </Modal.Actions>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          onClose={() => this.setState({ confirmationModal: false })}
          open={this.state.confirmationModal}
          size="mini"
        >
          <Modal.Header>Confirmar Eliminación</Modal.Header>
          <Modal.Content>
            <p>¿Estás seguro de que deseas eliminar este precio?</p>
          </Modal.Content>
          <Modal.Actions>
            <Button
              content="Cancelar"
              onClick={() => this.setState({ confirmationModal: false })}
            />
            <Button
              negative
              icon="trash"
              labelPosition="right"
              content="Eliminar"
              onClick={() => {
                this.props.deletePriceByID(this.state.priceToDelete.id);
                this.setState({ confirmationModal: false });
              }}
            />
          </Modal.Actions>
        </Modal>

        {/* Image Upload Modal */}
        <ImageUpload
          isOpen={showImageUploadModal}
          onClose={() => this.setState({ showImageUploadModal: false })}
          onImageUpload={this.handleImageUpload}
        />

        <Modal
          onClose={() => this.setState({ showBarcodeModal: false })}
          open={this.state.showBarcodeModal}
          size="mini"
        >
          <Modal.Header>Generar Códigos de Barras</Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Input
                label="Número de Códigos a Imprimir"
                type="number"
                min={1}
                value={this.state.barcodeCopies}
                onChange={(e) =>
                  this.setState({ barcodeCopies: parseInt(e.target.value, 10) })
                }
              />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={() => this.setState({ showBarcodeModal: false })}>
              Cancelar
            </Button>
            <Button
              positive
              icon="print"
              content="Vista previa e imprimir"
              onClick={this.generateAndPreviewBarcode}
            />
          </Modal.Actions>
        </Modal>
      </Container>
    );
  }
}

PricesView.propTypes = {
  getPrices: PropTypes.func.isRequired,
  savePrice: PropTypes.func.isRequired,
  updatePriceByID: PropTypes.func.isRequired,
  deletePriceByID: PropTypes.func.isRequired,
  prices: PropTypes.array.isRequired,
};

const actions = {
  getPrices,
  savePrice,
  updatePriceByID,
  deletePriceByID,
};

const mapStateToProps = (state) => ({
  prices: state.app.prices,
});

export default connect(mapStateToProps, actions)(PricesView);
