import React, { useState } from "react";
import ItemRow from "./ItemRow";
import styled from "styled-components";

const ItemListContainer = styled.div`
  margin-top: 20px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
`;

const Button = styled.button`
  background-color: #008CBA;
  color: white;
  padding: 10px 15px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
`;

const ItemList = ({ items, onAddItem }) => {
  const [newItem, setNewItem] = useState({
    descripcion: "",
    cantidad: "",
    precioUnidad: "",
  });
  const [showPopUp, setShowPopUp] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState(null);
  const [editingItems, setEditingItems] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewItem((prevItem) => ({
      ...prevItem,
      [name]: value,
    }));
  };

  const handleAddItem = () => {
    if (newItem.descripcion && newItem.cantidad && newItem.precioUnidad) {
      onAddItem({
        ...newItem,
        precioTotal: newItem.cantidad * newItem.precioUnidad,
      });
      setNewItem({ descripcion: "", cantidad: "", precioUnidad: "" });
    }
  };

  const handleEditItem = (item) => {
    setEditingItems((prev) => ({
      ...prev,
      [item.id]: !prev[item.id], // Toggle edit mode for the selected item
    }));
  };

  const handleDeleteItem = (item) => {
    const updatedItems = items.filter((i) => i.id !== item.id);
    onAddItem(updatedItems);
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], [name]: value };
    onAddItem(updatedItems);
  };

  return (
    <ItemListContainer>
      <h3>Elementos del Evento</h3>
      <Table>
        <thead>
          <tr>
            <Th>Descripción</Th>
            <Th>Cantidad</Th>
            <Th>Precio/Unidad</Th>
            <Th>Precio/Total</Th>
            <Th>Acciones</Th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <ItemRow
              key={item.id}  // Assuming each item has a unique 'id'
              item={item}
              onChange={(e) => handleChange(e, index)}
              isEditing={editingItems[item.id]}  // Pass the edit state
              onEdit={handleEditItem}
              onRemove={handleDeleteItem}
            />
          ))}
          <ItemRow
            item={newItem}
            onChange={handleInputChange}
            isNewItem
            onEdit={handleEditItem}
            onRemove={handleDeleteItem}
          />
        </tbody>
      </Table>
      <Button onClick={handleAddItem}>Agregar Elemento</Button>
    </ItemListContainer>
  );
};

export default ItemList;
