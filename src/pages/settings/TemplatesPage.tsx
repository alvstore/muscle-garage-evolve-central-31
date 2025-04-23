
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const TemplatesPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/settings/templates', { replace: true });
  }, [navigate]);
  
  return <Navigate to="/settings/templates" replace />;
};

export default TemplatesPage;
