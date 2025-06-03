import React from "react";
import PropTypes from "prop-types";
import { Icon, List, Popup } from "semantic-ui-react";

function Actions(props) {
  return (
    <Popup
      hoverable
      on="click"
      trigger={
        <div
          style={{
            borderRadius: "3px",
            padding: "5px",
            background: "none",
            cursor: "pointer",
          }}
        >
          <Icon
            style={{
              marginTop: 10,
              cursor: "pointer",
              color: "gray",
            }}
            name="ellipsis vertical"
          />
        </div>
      }
    >
      <Popup.Content>
        <List selection>
          <List.Item
            onClick={() => {
              props.onEdit(props.data);
            }}
          >
            <List.Content>
              <Icon name="edit" />
              Editar
            </List.Content>
          </List.Item>

          <List.Item
            onClick={() =>
              props.onRemove({ ...props.data })
            }
          >
            <List.Content>
              <Icon name="trash" />
              Eliminar
            </List.Content>
          </List.Item>
        </List>
      </Popup.Content>
    </Popup>
  );
}

Actions.propTypes = {
  data: PropTypes.object,
  onRemove: PropTypes.func,
  onEdit: PropTypes.func,
};

export default Actions;
