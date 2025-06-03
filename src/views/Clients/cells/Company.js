import React from 'react';
import PropTypes from 'prop-types';

function Company(props) {
  const { data } = props;

  return (
    <div>
      <p style={{ marginLeft: 12, marginBottom: 0, textAlign: 'left', color: '#000000' }}>
        {data.company}
      </p>
    </div>
  );
}


Company.propTypes = {
  data: PropTypes.object
};


export default Company;
