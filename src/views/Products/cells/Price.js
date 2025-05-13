import React from 'react';
import PropTypes from 'prop-types';

function Price(props) {
  const { data } = props;

  return (
    <div>
      <p style={{ marginLeft: 12, marginBottom: 0, textAlign: 'left', color: '#000000' }}>
        {"$" + data.price}
      </p>
    </div>
  );
}


Price.propTypes = {
  data: PropTypes.object
};


export default Price;
