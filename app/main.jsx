import React from 'react'
import ReactDOM from 'react-dom/client'
import FileUpload from './components/FileUpload'
import Camera from './components/Camera'
import Uploader from './pages/Uploader'
import 'bootstrap/dist/css/bootstrap.min.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Uploader />
  </React.StrictMode>,
)
