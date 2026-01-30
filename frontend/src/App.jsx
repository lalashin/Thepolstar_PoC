import React from 'react';
import { DashboardProvider } from './context/DashboardContext';
import Layout from './components/Layout';
import WidgetGrid from './components/WidgetGrid';
import Modal from './components/Modal';

function App() {
  return (
    <DashboardProvider>
      <Layout>
        <WidgetGrid />
      </Layout>
      <Modal />
    </DashboardProvider>
  );
}

export default App;
