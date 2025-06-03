import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const withRouterParams = (Component) => {
  const Wrapper = (props) => {
    const params = useParams();
    const navigate = useNavigate();
    return <Component {...props} params={params} navigate={navigate} />;
  };
  
  return Wrapper;
};

export default withRouterParams;
