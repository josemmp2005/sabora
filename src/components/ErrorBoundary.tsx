import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-4 text-center">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-xl max-w-md w-full border border-red-100 dark:border-red-900/30">
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500">
              <AlertTriangle className="w-8 h-8" />
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              ¡Ups! Algo se quemó en la cocina
            </h1>
            
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              Ha ocurrido un error inesperado. No te preocupes, nuestros chefs digitales ya están limpiando el desastre.
            </p>

            <div className="p-4 bg-gray-100 dark:bg-gray-700 rounded-xl mb-6 text-left overflow-hidden">
               <code className="text-xs text-red-500 font-mono break-all">
                 {this.state.error?.message || 'Error desconocido'}
               </code>
            </div>

            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-orange-600 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-orange-200 dark:shadow-none"
            >
              <RefreshCw className="w-5 h-5" />
              Recargar Página
            </button>
            
            <button
              onClick={() => window.location.href = '/'}
              className="w-full mt-3 py-3 text-gray-500 dark:text-gray-400 font-medium hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;