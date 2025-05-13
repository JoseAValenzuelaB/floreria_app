import React from 'react';
import PropTypes from 'prop-types';

function Total(props) {
  const { data } = props;

  return (
    <div>
      <p style={{ marginLeft: 12, marginBottom: 0, textAlign: 'left', color: '#000000' }}>
        {"$" + data.total}
      </p>
    </div>
  );
}


Total.propTypes = {
  data: PropTypes.object
};


export default Total;
