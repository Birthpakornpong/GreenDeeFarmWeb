// Simple fallback for white screen issues
import React from 'react';

export default function SimpleFallback() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f0fdf4',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{ textAlign: 'center', maxWidth: '500px', padding: '2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🌱</div>
        <h1 style={{ 
          fontSize: '2rem', 
          fontWeight: 'bold', 
          color: '#166534', 
          marginBottom: '1rem' 
        }}>
          Green Dee Farm
        </h1>
        <p style={{ 
          fontSize: '1.1rem', 
          color: '#16a34a', 
          marginBottom: '2rem',
          lineHeight: '1.6'
        }}>
          ฟาร์มผักไฮโดรโปนิกส์ครบวงจร<br />
          ผักใบเขียวออร์แกนิค สด สะอาด ปลอดภัย
        </p>
        
        <div style={{ 
          backgroundColor: 'white', 
          padding: '1.5rem', 
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          marginBottom: '2rem'
        }}>
          <h3 style={{ 
            fontSize: '1.2rem', 
            fontWeight: '600', 
            color: '#166534',
            marginBottom: '1rem'
          }}>
            ติดต่อสั่งซื้อ
          </h3>
          <div style={{ color: '#374151', lineHeight: '1.8' }}>
            <div>📞 <strong>064-542-0333</strong></div>
            <div>💬 <strong>Line: birhids</strong></div>
            <div>🚚 <strong>บริการพื้นที่:</strong> ภูเก็ต, ป่าง่า, กระบี่</div>
          </div>
        </div>

        <div style={{ 
          backgroundColor: '#dcfce7', 
          padding: '1rem', 
          borderRadius: '0.5rem',
          fontSize: '0.9rem',
          color: '#166534'
        }}>
          <strong>ผลิตภัณฑ์:</strong> เชียวกรีนโอ๊ค, ออกแดง, Green Cos<br />
          สดใหม่ทุกวัน ปลอดสารเคมี เก็บตรงจากฟาร์ม
        </div>

        <button 
          onClick={() => window.location.reload()}
          style={{
            marginTop: '2rem',
            backgroundColor: '#16a34a',
            color: 'white',
            padding: '0.75rem 2rem',
            borderRadius: '0.5rem',
            border: 'none',
            fontSize: '1rem',
            fontWeight: '500',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#15803d'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#16a34a'}
        >
          เข้าสู่เว็บไซต์
        </button>
      </div>
    </div>
  );
}