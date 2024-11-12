import { ReactNode } from 'react';
import { BrowserRouter } from 'react-router-dom';

interface WithRouterProps {
  children: ReactNode;
}

const WithRouter: React.FC<WithRouterProps> = ({ children }) => {
  return <BrowserRouter>{children}</BrowserRouter>;
};

export default WithRouter;
