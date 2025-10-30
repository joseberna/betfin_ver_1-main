// client/src/App.js
import React from 'react'
import AppRoutes from './components/routing/Routes'
import WalletProvider from './web3/wagmiConfig'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.scss'

const App = () => {
  return (

    <AppRoutes />

  )
}

export default App
