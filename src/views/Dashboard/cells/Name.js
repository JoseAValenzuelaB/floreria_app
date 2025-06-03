import React from 'react';
import PropTypes from 'prop-types';

function Name(props) {
  const { data } = props;

  return (
    <div>
      <p style={{ marginLeft: 12, marginBottom: 0, textAlign: 'left', color: '#000000' }}>
        {data.buyer_name}
      </p>
    </div>
  );
}


Name.propTypes = {
  data: PropTypes.object
};


export default Name;
