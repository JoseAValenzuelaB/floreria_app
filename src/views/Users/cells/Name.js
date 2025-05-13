import React from 'react';
import PropTypes from 'prop-types';

function Name(props) {
  const { data } = props;
  let name = data.first_name;
  if (data.last_name) {
    name += " " + data.last_name;
  }

  return (
    <div>
      <p style={{ marginLeft: 12, marginBottom: 0, textAlign: 'left', color: '#000000' }}>
        {name}
      </p>
    </div>
  );
}


Name.propTypes = {
  data: PropTypes.object
};


export default Name;
