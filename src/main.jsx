import react from 'react'

import ReactDOM from 'react-dom/client'

import {BrowserRouter as Router} from 'react-router-dom'

import App from './App'

import {PrivyProvider} from '@privy-io/react-auth';

import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'));

root.render(
    <PrivyProvider
      appId="cm7sd4r9300ma5jqtj7k9yog4"
      config={{
        
        // Customize Privy's appearance in your app
        appearance: {
          theme: 'dark',
          
        },
     
      }}
    >
        <Router>
            <App />
        </Router>
      
    </PrivyProvider>,
)
