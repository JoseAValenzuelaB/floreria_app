import React from 'react';
import PropTypes from 'prop-types';

function Email(props) {
  const { data } = props;

  return (
    <div>
      <p style={{ marginLeft: 12, marginBottom: 0, textAlign: 'left', color: '#000000' }}>
        {data.email}
      </p>
    </div>
  );
}


Email.propTypes = {
  data: PropTypes.object
};


export default Email;
