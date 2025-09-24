import React from 'react';

// Loading Component
export const LoadingScreen = ({ message = "กำลังโหลด..." }) => (
  <div className="min-h-screen bg-green-50 flex items-center justify-center">
    <div className="text-center">
      <div className="text-6xl mb-4 animate-bounce">🌱</div>
      <h1 className="text-2xl font-bold text-green-800 mb-2">Green Dee Farm</h1>
      <p className="text-green-600">{message}</p>
      <div className="mt-4">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    </div>
  </div>
);

// Error Boundary Component
export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 Green Dee Farm Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
            <div className="text-6xl mb-4">🌱</div>
            <h1 className="text-2xl font-bold text-green-800 mb-4">Green Dee Farm</h1>
            <p className="text-gray-600 mb-4">เกิดข้อผิดพลาดในการโหลดเว็บไซต์</p>
            <p className="text-sm text-gray-500 mb-4">กรุณาลองรีโหลดหน้าใหม่</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              รีโหลดหน้า
            </button>
            <div className="mt-6 pt-4 border-t border-gray-200 text-sm text-gray-500">
              <p className="mb-1">📞 064-542-0333</p>
              <p className="mb-1">💬 Line: birhids</p>
              <p>🚚 บริการ: ภูเก็ต, ป่าง่า, กระบี่</p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}