import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import NavBar from './components/NavBar'
import Main from './pages/Main'

export default function App() {
  return (
    <div className='flex flex-col min-h-screen'>
      <NavBar/>
      <Main/>
    </div>
  )
}