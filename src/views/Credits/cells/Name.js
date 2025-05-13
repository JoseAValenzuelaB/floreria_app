import React from 'react';
import PropTypes from 'prop-types';

function Name(props) {
  const { data, clients } = props;
  let clientName = "-";

  const client = (clients || []).find(clt => clt.id === data.client_id);
  if (client) {
    clientName = client.last_name ? client.name + " " + client.last_name : client.name;
  }

  return (
    <div>
      <p style={{ marginLeft: 12, marginBottom: 0, textAlign: 'left', color: '#000000' }}>
        {clientName}
      </p>
    </div>
  );
}


Name.propTypes = {
  data: PropTypes.object,
  clients: PropTypes.array
};


export default Name;
