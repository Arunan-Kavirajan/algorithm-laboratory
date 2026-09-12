import { useEffect, useState } from 'react'
import axios from 'axios'

function App() {
  const [health, setHealth] = useState<string>('Checking...')

  useEffect(() => {
    axios.get('http://localhost:8000/api/health')
      .then(res => setHealth(`Backend OK! Status: ${res.data.status}`))
      .catch(err => setHealth(`Backend Error: ${err.message}`))
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">Algorithm Laboratory</h1>
        <div className="p-4 bg-gray-50 rounded border border-gray-200">
          <p className="text-gray-600 font-medium">Backend Status:</p>
          <p className={`mt-2 ${health.includes('OK') ? 'text-green-600' : 'text-red-600'}`}>
            {health}
          </p>
        </div>
      </div>
    </div>
  )
}

export default App
