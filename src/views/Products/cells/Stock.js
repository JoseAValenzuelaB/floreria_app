import React from 'react';
import PropTypes from 'prop-types';

function Stock(props) {
  const { data } = props;

  return (
    <div>
      <p style={{ marginLeft: 12, marginBottom: 0, textAlign: 'left', color: '#000000' }}>
        {data.stock}
      </p>
    </div>
  );
}


Stock.propTypes = {
  data: PropTypes.object
};


export default Stock;
