import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layout';
import container from './views';

const AppRouter = () => {

  return (
    <Router>
      <Layout routes={container.routes} />
    </Router>
  );
};

export default AppRouter;
