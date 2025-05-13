import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import {
  Button,
  Container,
  Header,
  Modal,
  Form,
  Dropdown,
  Input,
  Icon,
} from "semantic-ui-react";
import {
  getProducts,
  saveProduct,
  updateProductByID,
} from "../../store/actions";
import CustomTable from "../../components/CustomTable";
import { CONTAINERS_BORDER } from "../../utils/Colors";
import Name from "./cells/Name";
import Description from "./cells/Description";
import Actions from "./cells/Actions";
import Price from "./cells/Price";
import Stock from "./cells/Stock";
import eventManager from "../../utils/eventManager";
import ImageUpload from "../../components/ImageUpload";

const options = [
  { key: "m", text: "Flores", value: "Flores" },
  { key: "f", text: "Arreglo", value: "Arreglo" },
  { key: "o", text: "Plantas", value: "Plantas" },
];

class ProductsView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      productToDelete: null,
      confirmationModal: false,
      showAddProductModal: false,
      imageUrl: "",
      isModalOpen: false,
      newProduct: {
        name: "",
        price: 0,
        category: "",
        stock: 0,
        description: "",
      },
      productToEdit: null,
      selectedCategory: "", // State for selected category filter
      searchTerm: "", // State for product name search filter
      selectedFile: null,
      uploading: false,
    };
  }

  componentDidMount() {
    this.props.getProducts();

    this.callbackID = eventManager.on("product_saved", () => {
      this.props.getProducts();
      this.setState({
        newProduct: {
          name: "",
          price: 0,
          category: "",
          stock: 0,
          description: "",
        },
      });
    });
  }

  componentWillUnmount() {
    eventManager.unsubscribe("product_saved", this.callbackID);
  }

  onSaveClick = () => {
    const { newProduct, productToEdit } = this.state;
    if (productToEdit) {
      this.props.updateProductByID({
        id: productToEdit.id,
        newValues: newProduct,
      });
    } else {
      this.props.saveProduct(newProduct);
    }

    this.setState({
      showAddProductModal: false,
      newProduct: {
        name: "",
        price: 0,
        category: "",
        stock: 0,
        description: "",
      },
      productToEdit: null,
    });
  };

  onEditClick = (product) => {
    this.setState({
      showAddProductModal: true,
      newProduct: { ...product },
      productToEdit: product,
    });
  };

  getFilteredProducts = () => {
    const { products } = this.props;
    const { selectedCategory, searchTerm } = this.state;

    return products.filter((product) => {
      const matchesCategory = selectedCategory
        ? product.category === selectedCategory
        : true;
      const matchesSearchTerm = product.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearchTerm;
    });
  };

  clearFilters = () => {
    this.setState({
      selectedCategory: "",
      searchTerm: "",
    });
  };

  getHeaders() {
    return [
      {
        label: "Nombre",
        component: <Name />,
        style: { background: "#F9FAFB", width: 250 },
      },
      {
        label: "Descripción",
        component: <Description />,
        style: { background: "#F9FAFB", width: 600 },
      },
      {
        label: "Precio",
        component: <Price />,
        style: { background: "#F9FAFB", width: 50 },
      },
      {
        label: "Inventario",
        component: <Stock />,
        style: { background: "#F9FAFB", width: 50 },
      },
      {
        label: "",
        component: (
          <Actions
            onRemove={(data) =>
              this.setState({ confirmationModal: true, productToDelete: data })
            }
            onEdit={(data) => this.onEditClick(data)}
          />
        ),
        style: { background: "#F9FAFB", paddingTop: 0 },
      },
    ];
  }

  handleOpenModal = () => {
    this.setState({ isModalOpen: true, showAddProductModal: false });
  };

  handleCloseModal = () => {
    this.setState({ isModalOpen: false });
  };

  handleImageUpload = (url) => {
    this.setState({ imageUrl: url });
  };

  handleFileChange = (event) => {
    this.setState({ selectedFile: event.target.files[0] });
  };

  handleUpload = async () => {
    const { selectedFile } = this.state;

    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      this.setState({ uploading: true });

      // Upload the image to the server
      const response = await axios.post(
        "http://localhost:8000/upload-image/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Pass the uploaded image URL to the parent component
      const { onImageUpload, onClose } = this.props;
      onImageUpload(response.data.image_url);

      alert("Image uploaded successfully!");
      onClose();
    } catch (error) {
      console.error("Error uploading the image:", error);
      alert("Failed to upload the image. Please try again.");
    } finally {
      this.setState({ uploading: false });
    }
  };

  render() {
    const { showAddProductModal, newProduct, productToEdit, uploading } = this.state;

    return (
      <Container style={{ marginTop: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <Header as="h1">Productos</Header>
          <div
            style={{ margin: "10px 0", display: "flex", alignItems: "center" }}
          >
            <Dropdown
              placeholder="Seleccionar Categoría"
              fluid
              selection
              options={options}
              value={this.state.selectedCategory} // Controlled component
              onChange={(e, { value }) =>
                this.setState({ selectedCategory: value })
              }
            />
            <Input
              placeholder="Buscar por Nombre..."
              onChange={(e) => this.setState({ searchTerm: e.target.value })}
              style={{ marginLeft: "10px", width: "200px" }}
            />
            <Button
              content="Limpiar Filtros"
              onClick={this.clearFilters}
              style={{
                marginLeft: "10px",
                backgroundColor: "rgb(255, 69, 58)",
                color: "white",
              }} // Example color
            />
          </div>

          <Button
            content="Agregar Producto"
            style={{ backgroundColor: "rgb(80, 135, 60)", color: "white" }}
            onClick={() => this.setState({ showAddProductModal: true })}
          />
          <Button
            onClick={() =>
              this.setState({
                showAddProductModal: false,
                productToEdit: null,
              })
            }
          >
            Subir Imagen
          </Button>
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
          data={this.getFilteredProducts()} // Use filtered products
        />

        <Modal
          onClose={() =>
            this.setState({ showAddProductModal: false, productToEdit: null })
          }
          open={showAddProductModal}
          size="small"
        >
          <Modal.Header>
            {productToEdit ? "Editar Producto" : "Agregar Nuevo Producto"}
          </Modal.Header>
          <Modal.Content>
            <Form>
              <Form.Group widths="equal">
                <Form.Input
                  fluid
                  label="Nombre"
                  placeholder="Nombre del producto"
                  value={newProduct.name}
                  onChange={(e) =>
                    this.setState({
                      newProduct: { ...newProduct, name: e.target.value },
                    })
                  }
                />
              </Form.Group>
              <Form.Group widths="equal">
                <Form.TextArea
                  fluid
                  label="Descripción"
                  placeholder="Descripción"
                  value={newProduct.description}
                  onChange={(e) =>
                    this.setState({
                      newProduct: {
                        ...newProduct,
                        description: e.target.value,
                      },
                    })
                  }
                />
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Input
                  fluid
                  label="Precio"
                  placeholder="Precio"
                  value={newProduct.price}
                  onChange={(e) =>
                    this.setState({
                      newProduct: {
                        ...newProduct,
                        price: Number(e.target.value),
                      },
                    })
                  }
                />
                <Form.Input
                  fluid
                  label="Inventario"
                  placeholder="Inventario"
                  value={newProduct.stock}
                  onChange={(e) =>
                    this.setState({
                      newProduct: {
                        ...newProduct,
                        stock: Number(e.target.value),
                      },
                    })
                  }
                />
              </Form.Group>
              <Form.Group widths="equal">
                <Form.Select
                  fluid
                  label="Categoría"
                  placeholder="Seleccionar"
                  value={newProduct.category}
                  options={options}
                  onChange={(_, e) => {
                    this.setState({
                      newProduct: {
                        ...newProduct,
                        category: e.value,
                      },
                    });
                  }}
                />
              </Form.Group>
              <Form.Group>
                <Button
                  onClick={() =>
                    this.setState({
                      showAddProductModal: false,
                      productToEdit: null,
                    })
                  }
                >
                  Subir Imagen
                </Button>
              </Form.Group>
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button color="red" onClick={this.handleOpenModal}>
              Cancelar
            </Button>
            <Button
              content={productToEdit ? "Guardar" : "Agregar"}
              labelPosition="right"
              icon="checkmark"
              onClick={this.onSaveClick}
              positive
            />
          </Modal.Actions>
        </Modal>

        <Modal
          onClose={() =>
            this.setState({ isModalOpen: false })
          }
          open={this.state.isModalOpen}
          size="small"
        >
          <Modal.Header>
            <Icon name="image outline" /> Upload an Image
          </Modal.Header>
          <Modal.Content>
            <Input
              type="file"
              accept="image/*"
              onChange={this.handleFileChange}
              fluid
            />
            {uploading && (
              <Loader active inline="centered" className="mt-3">
                Uploading...
              </Loader>
            )}
          </Modal.Content>
          <Modal.Actions>
            <Button
              color="blue"
              onClick={this.handleUpload}
              disabled={uploading}
            >
              <Icon name="upload" /> Upload
            </Button>
            <Button onClick={this.onClose} color="grey" disabled={uploading}>
              <Icon name="cancel" /> Cancel
            </Button>
          </Modal.Actions>
        </Modal>
      </Container>
    );
  }
}

ProductsView.propTypes = {
  getProducts: PropTypes.func.isRequired,
  saveProduct: PropTypes.func.isRequired,
  updateProductByID: PropTypes.func.isRequired,
  products: PropTypes.array.isRequired,
};

const actions = {
  getProducts,
  saveProduct,
  updateProductByID,
};

const mapStateToProps = (state) => ({
  products: state.app.products,
});

export default connect(mapStateToProps, actions)(ProductsView);
