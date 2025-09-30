// pages/connection-status.js - แสดงสถานะการเชื่อมต่อแบบ real-time
import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function ConnectionStatus() {
  const [status, setStatus] = useState({
    api: null,
    database: null,
    loading: true,
    lastTest: null
  });

  const testConnections = async () => {
    setStatus(prev => ({ ...prev, loading: true }));
    
    const results = {
      api: { status: 'testing', message: 'กำลังทดสอบ API...' },
      database: { status: 'testing', message: 'กำลังทดสอบฐานข้อมูล...' },
      loading: true,
      lastTest: new Date().toLocaleString('th-TH')
    };
    
    setStatus(results);

    // Test API Health
    try {
      const apiResponse = await fetch('/api/health-check');
      const apiData = await apiResponse.json();
      
      if (apiResponse.ok) {
        results.api = {
          status: 'success',
          message: 'API ทำงานปกติ',
          data: apiData
        };
      } else {
        results.api = {
          status: 'error',
          message: 'API มีปัญหา',
          error: apiData
        };
      }
    } catch (error) {
      results.api = {
        status: 'error',
        message: 'ไม่สามารถเชื่อมต่อ API ได้',
        error: error.message
      };
    }

    // Test Database Connection
    try {
      const dbResponse = await fetch('/api/test-db');
      const dbData = await dbResponse.json();
      
      if (dbResponse.ok && dbData.success) {
        results.database = {
          status: 'success',
          message: 'เชื่อมต่อฐานข้อมูลสำเร็จ',
          data: dbData
        };
      } else {
        results.database = {
          status: 'error',
          message: 'ไม่สามารถเชื่อมต่อฐานข้อมูลได้',
          error: dbData.message || 'Unknown error',
          suggestions: dbData.suggestions
        };
      }
    } catch (error) {
      results.database = {
        status: 'error',
        message: 'เกิดข้อผิดพลาดในการทดสอบฐานข้อมูล',
        error: error.message
      };
    }

    results.loading = false;
    setStatus(results);
  };

  useEffect(() => {
    testConnections();
  }, []);

  const StatusCard = ({ title, status, icon }) => {
    const getStatusColor = (status) => {
      switch (status?.status) {
        case 'success': return 'border-green-200 bg-green-50';
        case 'error': return 'border-red-200 bg-red-50';
        case 'testing': return 'border-yellow-200 bg-yellow-50';
        default: return 'border-gray-200 bg-gray-50';
      }
    };

    const getStatusIcon = (status) => {
      switch (status?.status) {
        case 'success': return '✅';
        case 'error': return '❌';
        case 'testing': return '⏳';
        default: return '❓';
      }
    };

    return (
      <div className={`border-2 rounded-lg p-6 ${getStatusColor(status)}`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <span className="text-2xl mr-3">{icon}</span>
            <h3 className="text-lg font-semibold">{title}</h3>
          </div>
          <span className="text-2xl">{getStatusIcon(status)}</span>
        </div>
        
        <p className="text-sm font-medium mb-2">{status?.message}</p>
        
        {status?.error && (
          <div className="bg-red-100 border border-red-200 rounded p-3 mb-3">
            <p className="text-red-800 text-sm font-medium">ข้อผิดพลาด:</p>
            <p className="text-red-700 text-sm">{status.error}</p>
          </div>
        )}
        
        {status?.suggestions && (
          <div className="bg-blue-100 border border-blue-200 rounded p-3">
            <p className="text-blue-800 text-sm font-medium mb-2">คำแนะนำ:</p>
            <ul className="text-blue-700 text-sm space-y-1">
              {status.suggestions.map((suggestion, index) => (
                <li key={index}>• {suggestion}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Head>
        <title>Connection Status - Green Dee Farm</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              🌱 Green Dee Farm - Connection Status
            </h1>
            <p className="text-gray-600 mb-4">
              ตรวจสอบสถานะการเชื่อมต่อระบบ
            </p>
            {status.lastTest && (
              <p className="text-sm text-gray-500">
                ทดสอบล่าสุด: {status.lastTest}
              </p>
            )}
            <button 
              onClick={testConnections}
              disabled={status.loading}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {status.loading ? '🔄 กำลังทดสอบ...' : '🔄 ทดสอบใหม่'}
            </button>
          </div>

          {/* Status Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <StatusCard 
              title="API Status" 
              status={status.api}
              icon="🚀"
            />
            <StatusCard 
              title="Database Status" 
              status={status.database}
              icon="🗄️"
            />
          </div>

          {/* Overall Status */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">📊 สรุปสถานะระบบ</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>API:</span>
                <span className={`font-medium ${
                  status.api?.status === 'success' ? 'text-green-600' : 
                  status.api?.status === 'error' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {status.api?.status === 'success' ? 'ปกติ' : 
                   status.api?.status === 'error' ? 'มีปัญหา' : 'กำลังทดสอบ'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Database:</span>
                <span className={`font-medium ${
                  status.database?.status === 'success' ? 'text-green-600' : 
                  status.database?.status === 'error' ? 'text-red-600' : 'text-yellow-600'
                }`}>
                  {status.database?.status === 'success' ? 'เชื่อมต่อได้' : 
                   status.database?.status === 'error' ? 'เชื่อมต่อไม่ได้' : 'กำลังทดสอบ'}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">⚡ เมนูด่วน</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <a 
                href="/api/health-check" 
                target="_blank"
                className="bg-blue-100 hover:bg-blue-200 p-3 rounded text-center text-blue-700 font-medium"
              >
                🏥 Health Check
              </a>
              <a 
                href="/api/test-db" 
                target="_blank"
                className="bg-purple-100 hover:bg-purple-200 p-3 rounded text-center text-purple-700 font-medium"
              >
                🗄️ Test DB
              </a>
              <a 
                href="/api/debug-connection" 
                target="_blank"
                className="bg-orange-100 hover:bg-orange-200 p-3 rounded text-center text-orange-700 font-medium"
              >
                🔧 Debug
              </a>
              <a 
                href="/test-connection" 
                className="bg-gray-100 hover:bg-gray-200 p-3 rounded text-center text-gray-700 font-medium"
              >
                📋 Full Test
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div className="text-center">
            <a href="/" className="text-green-600 hover:text-green-700 font-medium">
              ← กลับหน้าหลัก Green Dee Farm
            </a>
          </div>
        </div>
      </div>
    </>
  );
}