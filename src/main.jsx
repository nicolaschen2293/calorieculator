import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import FileUpload from './components/FileUpload'
import 'bootstrap/dist/css/bootstrap.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <FileUpload />
  </React.StrictMode>,
)
