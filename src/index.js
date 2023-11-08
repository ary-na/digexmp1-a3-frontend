import App from './App.js'

// components (custom web components)
import './components/co-app-header'
import './components/co-drink-card'
import './components/co-barista-card'

// styles
import './scss/master.scss'

// app.init
document.addEventListener('DOMContentLoaded', () => {
  App.init()
})