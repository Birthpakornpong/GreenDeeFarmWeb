// pages/auth/login.js - Login page
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          // User is already logged in, redirect to dashboard
          router.push('/dashboard');
        }
      } catch (error) {
        // User not logged in, stay on login page
      }
    };

    checkAuth();
  }, [router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        // Login successful, redirect to dashboard or intended page
        const redirectTo = router.query.redirect || '/dashboard';
        router.push(redirectTo);
      } else {
        setError(data.message || 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>เข้าสู่ระบบ - Green Dee Farm</title>
        <meta name="description" content="เข้าสู่ระบบเพื่อสั่งซื้อผักออร์แกนิคจาก Green Dee Farm" />
      </Head>

      <div className="min-h-screen bg-green-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="text-4xl mb-4">🌱</div>
            <h1 className="text-3xl font-bold text-green-800 mb-2">Green Dee Farm</h1>
            <h2 className="text-xl text-gray-600">เข้าสู่ระบบ</h2>
          </div>

          {/* Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            {error && (
              <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username หรือ Email
                </label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="username หรือ email ของคุณ"
                />
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="password ของคุณ"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'กำลังเข้าสู่ระบบ...' : 'เข้าสู่ระบบ'}
              </button>
            </form>

            {/* Register Link */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                ยังไม่มีบัญชี?{' '}
                <Link href="/auth/register" className="text-green-600 hover:text-green-700 font-medium">
                  สมัครสมาชิก
                </Link>
              </p>
            </div>

            {/* Forgot Password Link */}
            <div className="mt-4 text-center">
              <Link href="/auth/forgot-password" className="text-gray-500 hover:text-gray-700 text-sm">
                ลืม password?
              </Link>
            </div>

            {/* Home Link */}
            <div className="mt-4 text-center">
              <Link href="/" className="text-gray-500 hover:text-gray-700 text-sm">
                ← กลับหน้าหลัก
              </Link>
            </div>
          </div>

          {/* Demo Account Info */}
          <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-yellow-800 mb-2">💡 ข้อมูลสำหรับทดสอบ:</h3>
            <p className="text-yellow-700 text-sm">
              หลังจากสร้างตาราง users ในฐานข้อมูลแล้ว คุณสามารถสมัครสมาชิกใหม่ได้เลย
            </p>
          </div>
        </div>
      </div>
    </>
  );
}