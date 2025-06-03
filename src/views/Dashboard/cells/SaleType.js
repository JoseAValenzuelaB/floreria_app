import React from 'react';
import PropTypes from 'prop-types';
import { PAYMENT_TYPE_DICT } from '../../../utils/constants';

function SaleType(props) {
  const { data } = props;

  return (
    <div>
      <p style={{ marginLeft: 12, marginBottom: 0, textAlign: 'left', color: '#000000' }}>
        {PAYMENT_TYPE_DICT[data.payment_type]}
      </p>
    </div>
  );
}


SaleType.propTypes = {
  data: PropTypes.object
};


export default SaleType;
