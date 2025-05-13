import React, { Component } from "react";
import PropTypes from "prop-types"; // Import PropTypes for props validation
import { Modal, Button, Icon, Loader, Input, Image } from "semantic-ui-react";
import axios from "axios";
import { API_URL } from "../utils/constants";

class ImageUpload extends Component {
  state = {
    selectedFile: null,
    uploading: false,
    imagePreviewUrl: null, // State for the image preview
  };

  // Handle file selection
  handleFileChange = (event) => {
    const file = event.target.files[0];
    this.setState({
      selectedFile: file,
      imagePreviewUrl: URL.createObjectURL(file), // Set the image preview URL
    });
  };

  // Handle file upload
  handleUpload = async () => {
    const { selectedFile } = this.state;

    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }

    // // Add optional file size limit (5MB in this case)
    // if (selectedFile.size > 5 * 1024 * 1024) {
    //   alert("File size exceeds 5MB. Please upload a smaller file.");
    //   return;
    // }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      this.setState({ uploading: true });

      // Upload the image to the FastAPI server
      const response = await axios.post(
        `${API_URL}/api/media/upload/`, // ✅ Corrected endpoint
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { onImageUpload, onClose } = this.props;
      onImageUpload(response.data.url);

      alert("La imagen se subió correctamente!");
      onClose();
    } catch (error) {
      console.error("Error uploading the image:", error);
      alert("Error al subir imagen.");
    } finally {
      this.setState({ uploading: false });
    }
  };

  render() {
    const { isOpen, onClose } = this.props; // Props destructuring
    const { uploading, imagePreviewUrl } = this.state;

    return (
      <Modal open={isOpen} onClose={onClose} size="small">
        <Modal.Header>
          <Icon name="image outline" /> Agregar Imagen
        </Modal.Header>
        <Modal.Content>
          <Input
            type="file"
            accept="image/*"
            onChange={this.handleFileChange}
            fluid
          />
          
          {/* Image Preview */}
          {imagePreviewUrl && (
            <Image 
              src={imagePreviewUrl} 
              size="medium" 
              style={{ marginTop: '15px', maxWidth: '100%' }} 
            />
          )}

          {uploading && (
            <Loader active inline="centered" className="mt-3">
              Subiendo...
            </Loader>
          )}
        </Modal.Content>
        <Modal.Actions>
          <Button
            color="blue"
            onClick={this.handleUpload}
            disabled={uploading}
          >
            <Icon name="upload" /> Subir
          </Button>
          <Button onClick={onClose} color="grey" disabled={uploading}>
            <Icon name="cancel" /> Cancelar
          </Button>
        </Modal.Actions>
      </Modal>
    );
  }
}

// **Prop Types**
ImageUpload.propTypes = {
  isOpen: PropTypes.bool.isRequired, // Controls if the modal is open
  onClose: PropTypes.func.isRequired, // Function to close the modal
  onImageUpload: PropTypes.func.isRequired, // Function to handle the uploaded image URL
};

export default ImageUpload;
