import React from 'react';
import PropTypes from 'prop-types';

function Description(props) {
  const { data } = props;

  return (
    <div>
      <p style={{ marginLeft: 12, marginBottom: 0, textAlign: 'left', color: '#000000' }}>
        {data.description}
      </p>
    </div>
  );
}


Description.propTypes = {
  data: PropTypes.object
};


export default Description;
