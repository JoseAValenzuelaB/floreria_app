import React from 'react';
import PropTypes from 'prop-types';
import { ORDER_STATUS } from '../../../utils/constants';

function OrderStatus(props) {
  const { data } = props;

  return (
    <div>
      <p style={{ marginLeft: 12, marginBottom: 0, textAlign: 'left', color: '#000000' }}>
        {ORDER_STATUS[data.status]}
      </p>
    </div>
  );
}


OrderStatus.propTypes = {
  data: PropTypes.object
};


export default OrderStatus;
