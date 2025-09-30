// pages/test-connection.js - หน้าทดสอบการเชื่อมต่อฐานข้อมูล
import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function TestConnection() {
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    testConnections();
  }, []);

  const testConnections = async () => {
    setLoading(true);
    const tests = {};

    // Test 1: Health Check
    try {
      const response = await fetch('/api/health-check');
      tests.healthCheck = await response.json();
    } catch (error) {
      tests.healthCheck = { error: error.message };
    }

    // Test 2: Database Connection
    try {
      const response = await fetch('/api/test-db');
      tests.dbConnection = await response.json();
    } catch (error) {
      tests.dbConnection = { error: error.message };
    }

    // Test 3: Debug Connection
    try {
      const response = await fetch('/api/debug-connection');
      tests.debugConnection = await response.json();
    } catch (error) {
      tests.debugConnection = { error: error.message };
    }

    setResults(tests);
    setLoading(false);
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      success: 'bg-green-100 text-green-800',
      partial_success: 'bg-yellow-100 text-yellow-800',
      failed: 'bg-red-100 text-red-800',
      error: 'bg-red-100 text-red-800',
      healthy: 'bg-green-100 text-green-800'
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
        {status}
      </span>
    );
  };

  return (
    <>
      <Head>
        <title>Database Connection Test - Green Dee Farm</title>
      </Head>

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">🔧 Database Connection Test</h1>
            <p className="text-gray-600">ทดสอบการเชื่อมต่อฐานข้อมูล Green Dee Farm</p>
            <button 
              onClick={testConnections}
              className="mt-4 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              disabled={loading}
            >
              {loading ? 'กำลังทดสอบ...' : 'ทดสอบใหม่'}
            </button>
          </div>

          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">กำลังทดสอบการเชื่อมต่อ...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Health Check */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">1. Health Check</h2>
                  <StatusBadge status={results.healthCheck?.status} />
                </div>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(results.healthCheck, null, 2)}
                </pre>
              </div>

              {/* Database Connection */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">2. Database Connection</h2>
                  <StatusBadge status={results.dbConnection?.success ? 'success' : 'failed'} />
                </div>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                  {JSON.stringify(results.dbConnection, null, 2)}
                </pre>
              </div>

              {/* Debug Connection */}
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">3. Debug Connection</h2>
                  <StatusBadge status={results.debugConnection?.overall_status} />
                </div>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
                  {JSON.stringify(results.debugConnection, null, 2)}
                </pre>
              </div>

              {/* Recommendations */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">💡 คำแนะนำการแก้ไข</h3>
                <div className="space-y-2 text-sm text-blue-700">
                  <p>• ตรวจสอบข้อมูลการเชื่อมต่อใน Plesk Control Panel</p>
                  <p>• ไปที่ Databases → เลือก database → ดู Connection Info</p>
                  <p>• คัดลอก Host, Port, Database Name, Username ที่ถูกต้อง</p>
                  <p>• สร้างตาราง users ด้วย SQL ที่ให้ไว้</p>
                  <p>• หากยังไม่ได้ ลองใช้ SQLite สำหรับการทดสอบ</p>
                </div>
              </div>

              {/* Navigation */}
              <div className="text-center">
                <a href="/" className="text-green-600 hover:text-green-700 font-medium">
                  ← กลับหน้าหลัก
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}