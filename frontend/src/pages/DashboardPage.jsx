import React from 'react';
import { useParams } from 'react-router-dom';
import Dashboard from '../components/Dashboard';

const DashboardPage = () => {
  const { section } = useParams();
  return <Dashboard section={section} />;
};

export default DashboardPage; 