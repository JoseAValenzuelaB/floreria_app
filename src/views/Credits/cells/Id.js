import React from 'react';
import PropTypes from 'prop-types';
import { BLUE } from '../../../utils/Colors';
import { Link } from 'react-router-dom';

function IdCell(props) {
  const { data } = props;

  return (
    <div>
      <Link to={`/order-details/${data.id}`}>
        <p style={{ marginLeft: 12, marginBottom: 0, textAlign: 'left', color: '#000000', cursor: "pointer", color: BLUE }}>
          {data.id}
        </p>
      </Link>
    </div>
  );
}


IdCell.propTypes = {
  data: PropTypes.object,
};


export default IdCell;
