import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AuthProvider from "react-auth-kit";

import { store } from './assets/store';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <QueryClientProvider client={queryClient}>
    <AuthProvider store={store}>

    <App />
    </AuthProvider>
  </QueryClientProvider>
);
