import React, { useState } from 'react';
import { Modal, Form, Input, Button } from 'semantic-ui-react';

const AddProductModal = ({ open, onClose, onSubmit }) => {
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');

  const handleProductNameChange = (e) => {
    setProductName(e.target.value);
  };

  const handleProductPriceChange = (e) => {
    setProductPrice(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit({ name: productName, price: parseFloat(productPrice) });
    setProductName('');
    setProductPrice('');
  };

  return (
    <Modal onClose={onClose} open={open} size='tiny'>
      <Modal.Header>Agregar Nuevo Producto</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <label>Nombre del Producto</label>
            <Input value={productName} onChange={handleProductNameChange} />
          </Form.Field>
          <Form.Field>
            <label>Precio del Producto</label>
            <Input type='number' value={productPrice} onChange={handleProductPriceChange} />
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button color='red' onClick={onClose}>
          Cancelar
        </Button>
        <Button
          content='Agregar'
          labelPosition='right'
          icon='checkmark'
          onClick={handleSubmit}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
};

export default AddProductModal;
