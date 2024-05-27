// import logo from './logo.svg';
 

import { Route, Routes } from 'react-router-dom';
 
import Notfound from './Pages/NotFound';
import Kitchens from './Pages/Kitchens';
import Menu from './Pages/Menu';
import './App.css';

function App() {

  return (
    <div className="App">
          <Routes>
            <Route path='/' element={<Kitchens/>}/>
            <Route path='/menu/:kitchen_id' element={<Menu/>}/>
            <Route  path="*" element={<Notfound/>}/>
          </Routes>
    </div>
  );
}
export default App;