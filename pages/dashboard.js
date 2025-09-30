// pages/dashboard.js - User dashboard after login
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const userData = await response.json();
          setUser(userData.user);
        } else {
          // Not authenticated, redirect to login
          router.push('/auth/login?redirect=/dashboard');
        }
      } catch (error) {
        console.error('Auth check error:', error);
        router.push('/auth/login?redirect=/dashboard');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST'
      });
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Force redirect even if logout fails
      router.push('/');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-green-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
    <>
      <Head>
        <title>Dashboard - Green Dee Farm</title>
        <meta name="description" content="Dashboard สำหรับสมาชิก Green Dee Farm" />
      </Head>

      <div className="min-h-screen bg-green-50">
        {/* Header */}
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center">
                <div className="text-2xl mr-3">🌱</div>
                <div>
                  <h1 className="text-xl font-bold text-green-800">Green Dee Farm</h1>
                  <p className="text-sm text-gray-600">Dashboard</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">สวัสดี, {user.full_name || user.username}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  ออกจากระบบ
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          {/* Welcome Section */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h2 className="text-2xl font-bold text-green-800 mb-4">
              ยินดีต้อนรับสู่ Green Dee Farm Dashboard!
            </h2>
            <p className="text-gray-600 mb-4">
              ขอบคุณที่เป็นสมาชิกกับเรา คุณสามารถจัดการข้อมูลส่วนตัวและดูประวัติการสั่งซื้อได้ที่นี่
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">🛒 สั่งซื้อผัก</h3>
                <p className="text-sm text-gray-600">เลือกซื้อผักออร์แกนิคสดใหม่</p>
                <Link href="/" className="text-green-600 hover:text-green-700 text-sm font-medium">
                  ดูสินค้า →
                </Link>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">📋 ประวัติการสั่งซื้อ</h3>
                <p className="text-sm text-gray-600">ดูรายการสั่งซื้อทั้งหมด</p>
                <Link href="/orders" className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                  ดูประวัติ →
                </Link>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h3 className="font-semibold text-yellow-800 mb-2">👤 ข้อมูลส่วนตัว</h3>
                <p className="text-sm text-gray-600">จัดการข้อมูลส่วนตัว</p>
                <Link href="/profile" className="text-yellow-600 hover:text-yellow-700 text-sm font-medium">
                  แก้ไขข้อมูล →
                </Link>
              </div>
            </div>
          </div>

          {/* User Info */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
            <h3 className="text-xl font-bold text-gray-800 mb-4">ข้อมูลส่วนตัว</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-600">Username:</label>
                <p className="text-gray-800">{user.username}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">Email:</label>
                <p className="text-gray-800">{user.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">ชื่อ-นามสกุล:</label>
                <p className="text-gray-800">{user.full_name || 'ยังไม่ได้กรอก'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">เบอร์โทรศัพท์:</label>
                <p className="text-gray-800">{user.phone || 'ยังไม่ได้กรอก'}</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-600">ที่อยู่:</label>
                <p className="text-gray-800">{user.address || 'ยังไม่ได้กรอก'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600">สมัครสมาชิกเมื่อ:</label>
                <p className="text-gray-800">
                  {new Date(user.created_at).toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">เมню</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/" className="bg-green-600 text-white p-4 rounded-lg hover:bg-green-700 transition-colors text-center block">
                <div>
                  <div className="text-2xl mb-2">🏠</div>
                  <div className="font-medium">หน้าหลัก</div>
                </div>
              </Link>
              <Link href="/news" className="bg-blue-600 text-white p-4 rounded-lg hover:bg-blue-700 transition-colors text-center block">
                <div>
                  <div className="text-2xl mb-2">📰</div>
                  <div className="font-medium">ข่าวสาร</div>
                </div>
              </Link>
              <Link href="/contact" className="bg-yellow-600 text-white p-4 rounded-lg hover:bg-yellow-700 transition-colors text-center block">
                <div>
                  <div className="text-2xl mb-2">📞</div>
                  <div className="font-medium">ติดต่อเรา</div>
                </div>
              </Link>
              <Link href="/about" className="bg-purple-600 text-white p-4 rounded-lg hover:bg-purple-700 transition-colors text-center block">
                <div>
                  <div className="text-2xl mb-2">ℹ️</div>
                  <div className="font-medium">เกี่ยวกับเรา</div>
                </div>
              </Link>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}