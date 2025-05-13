import React from 'react';
import PropTypes from 'prop-types';

function Phone(props) {
  const { data } = props;

  return (
    <div>
      <p style={{ marginLeft: 12, marginBottom: 0, textAlign: 'left', color: '#000000' }}>
        {data.phone_number}
      </p>
    </div>
  );
}


Phone.propTypes = {
  data: PropTypes.object
};


export default Phone;
