'use client'

import { useAuth } from '@/contexts/AuthContext'
import { auth } from '@/lib/firebase'
import { useEffect, useState } from 'react'

export default function TestAuthPage() {
  const { user, loading, loginWithGoogle } = useAuth()
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (message: string) => {
    console.log(message)
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`])
  }

  useEffect(() => {
    addLog('TestAuth page loaded')
    addLog(`Firebase Auth initialized: ${!!auth}`)
    addLog(`User state: ${user ? 'logged in' : 'not logged in'}`)
    addLog(`Loading state: ${loading}`)
  }, [user, loading])

  const handleTestGoogleLogin = async () => {
    try {
      addLog('Testing Google login...')
      await loginWithGoogle()
      addLog('Google login successful!')
    } catch (error: any) {
      addLog(`Google login failed: ${error.message}`)
    }
  }

  const handleTestFirebaseConfig = () => {
    addLog('Testing Firebase config...')
    addLog(`API Key: ${auth.app.options.apiKey ? 'Present' : 'Missing'}`)
    addLog(`Auth Domain: ${auth.app.options.authDomain}`)
    addLog(`Project ID: ${auth.app.options.projectId}`)
  }

  return (
    <div className="min-h-screen p-8 bg-gray-900 text-white">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Firebase Auth Test</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Controls */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Controls</h2>
            
            <button
              onClick={handleTestFirebaseConfig}
              className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              Test Firebase Config
            </button>
            
            <button
              onClick={handleTestGoogleLogin}
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Test Google Login'}
            </button>
            
            <div className="p-4 bg-gray-800 rounded">
              <h3 className="font-semibold mb-2">Current State:</h3>
              <p>User: {user ? user.email : 'None'}</p>
              <p>Loading: {loading ? 'Yes' : 'No'}</p>
              <p>UID: {user?.uid || 'None'}</p>
            </div>
          </div>
          
          {/* Logs */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Debug Logs</h2>
            <div className="bg-black p-4 rounded h-96 overflow-y-auto font-mono text-sm">
              {logs.map((log, index) => (
                <div key={index} className="mb-1 text-green-400">
                  {log}
                </div>
              ))}
            </div>
            <button
              onClick={() => setLogs([])}
              className="mt-2 bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-sm"
            >
              Clear Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
