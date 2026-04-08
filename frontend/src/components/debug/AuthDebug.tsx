import { useState } from 'react';
import { teacherApi } from '../../services/teacherApi';

export function AuthDebug() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const checkAuth = async () => {
    setLoading(true);
    const info: any = {};

    // Check localStorage
    info.authToken = localStorage.getItem('auth_token') ? 'EXISTS' : 'NOT FOUND';
    info.authRole = localStorage.getItem('auth_role');
    info.user = localStorage.getItem('user');

    // Test API call
    try {
      const response = await teacherApi.exams.getAll();
      info.apiTest = { success: true, data: response };
    } catch (error: any) {
      info.apiTest = { success: false, error: error.message };
    }

    setDebugInfo(info);
    setLoading(false);
  };

  return (
    <div className="fixed top-4 right-4 bg-white p-4 border rounded shadow-lg z-50 max-w-md">
      <h3 className="font-bold mb-2">Auth Debug</h3>
      <button 
        onClick={checkAuth}
        disabled={loading}
        className="bg-blue-500 text-white px-3 py-1 rounded mb-2"
      >
        {loading ? 'Checking...' : 'Check Auth'}
      </button>
      
      {debugInfo && (
        <div className="text-xs">
          <div><strong>Token:</strong> {debugInfo.authToken}</div>
          <div><strong>Role:</strong> {debugInfo.authRole}</div>
          <div><strong>User:</strong> {debugInfo.user ? 'EXISTS' : 'NOT FOUND'}</div>
          <div><strong>API Test:</strong> {debugInfo.apiTest.success ? 'SUCCESS' : 'FAILED'}</div>
          {!debugInfo.apiTest.success && (
            <div className="text-red-500 mt-1">
              Error: {debugInfo.apiTest.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}