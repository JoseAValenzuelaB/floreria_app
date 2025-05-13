import React from 'react';
import PropTypes from 'prop-types';

const roleOptions = [
  { key: "admin", text: "Administrador", value: "admin" },
  { key: "cashier", text: "Cajero", value: "cashier" },
  { key: "florist", text: "Florista", value: "florist" },
  { key: "employee", text: "Otro", value: "employee" },
  { key: "default", text: "Predeterminado", value: "default" },
];

const roleDict = {
  "admin": "Administrador",
  "cashier": "Cajero/a",
  "florist": "Florista",
  "employee": "Otro",
  "default": "Predeterminado"
};


function RoleType(props) {
  const { data } = props;

  return (
    <div>
      <p style={{ marginLeft: 12, marginBottom: 0, textAlign: 'left', color: '#000000' }}>
        {roleDict[data.type]}
      </p>
    </div>
  );
}


RoleType.propTypes = {
  data: PropTypes.object
};


export default RoleType;
