import React from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Icon, List, Popup } from "semantic-ui-react";
import Actions from "./Actions"; // Assuming Actions is in the same folder

const Td = styled.td`
  border: 1px solid #ddd;
  padding: 8px;
`;

const Input = styled.input`
  width: 100%;
  padding: 5px;
  border: 1px solid #ddd;
  border-radius: 4px;
`;

const ItemRow = ({ item, onChange, isNewItem, onEdit, onRemove, isEditing }) => {
  if (isNewItem) {
    return (
      <tr>
        <Td>
          <Input
            type="text"
            name="descripcion"
            value={item.descripcion}
            onChange={onChange}
            placeholder="Descripción"
          />
        </Td>
        <Td>
          <Input
            type="number"
            name="cantidad"
            value={item.cantidad}
            onChange={onChange}
            placeholder="Cantidad"
          />
        </Td>
        <Td>
          <Input
            type="number"
            name="precioUnidad"
            value={item.precioUnidad}
            onChange={onChange}
            placeholder="Precio/Unidad"
          />
        </Td>
        <Td>
          {item.cantidad && item.precioUnidad
            ? (item.cantidad * item.precioUnidad).toFixed(2)
            : ""}
        </Td>
      </tr>
    );
  }

  return (
    <tr>
      <Td>
        {isEditing ? (
          <Input
            type="text"
            name="descripcion"
            value={item.descripcion}
            onChange={onChange}
            placeholder="Descripción"
          />
        ) : (
          item.descripcion
        )}
      </Td>
      <Td>
        {isEditing ? (
          <Input
            type="number"
            name="cantidad"
            value={item.cantidad}
            onChange={onChange}
            placeholder="Cantidad"
          />
        ) : (
          item.cantidad
        )}
      </Td>
      <Td>
        {isEditing ? (
          <Input
            type="number"
            name="precioUnidad"
            value={item.precioUnidad}
            onChange={onChange}
            placeholder="Precio/Unidad"
          />
        ) : (
          item.precioUnidad
        )}
      </Td>
      <Td>
        {isEditing
          ? (item.cantidad * item.precioUnidad).toFixed(2)
          : item.precioTotal.toFixed(2)}
      </Td>
      <Td>
        <Actions
          data={item}
          onEdit={() => onEdit(item)}  // Pass the item to edit
          onRemove={() => onRemove(item)} // Pass the item to remove
        />
      </Td>
    </tr>
  );
};

ItemRow.propTypes = {
  item: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  isNewItem: PropTypes.bool,
  onEdit: PropTypes.func,
  onRemove: PropTypes.func,
  isEditing: PropTypes.bool,  // New prop to control edit state
};

export default ItemRow;
