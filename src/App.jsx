import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';

// Lazy-loaded components
const EmployeeList = lazy(() => import('./components/EmployeeList'));
const RoleList = lazy(() => import('./components/RoleList'));
const CreateRole = lazy(() => import('./components/CreateRole'));

function App() {
  
  return (
    <BrowserRouter>
      <Navbar />
      <div className="container mt-4">
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/" element={<Navigate to="/employees" />} />
            <Route path="/employees" element={<EmployeeList />} />
            <Route path="/roles" element={<RoleList />} />
            <Route path="/edit-role/:roleId" element={<CreateRole isEdit />} />
            <Route path="/create-role" element={<CreateRole isEdit={false} />} />
          </Routes>
        </Suspense>
      </div>
    </BrowserRouter>
  );
}

export default App;
