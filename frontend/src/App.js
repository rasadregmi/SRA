import './App.css';
import Routes from './routes'; // Import your routes
import Navbar from './components/navbar'; // Import the Navbar

function App() {
  return (
    <div>
      <Navbar />  {/* Navbar will be displayed on all pages */}
      <Routes />   {/* Render all routes defined in routes.js */}
    </div>
  );
}

export default App;
