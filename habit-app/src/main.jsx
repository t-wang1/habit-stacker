import React from 'react'
import ReactDOM from 'react-dom/client'
import Header from './header.jsx'
import Resize from './resize.jsx'
import PredictionResult from './response.jsx'
import HabitsList from './display_log.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <>
    <Header />
    <Resize />
    <PredictionResult />
    {/* <HabitsList /> */}
  </>
)
