import './style.css'
import { useNavigate } from 'react-router-dom'; // Импортируем хук useNavigate, который позволяет программе перемещать пользователя между различными страницами приложения

// Определяем функциональный компонент Rooms. Он получает несколько пропсов из App
const Rooms = ({socket }) => { 
  
      
  return ( // Возвращащем JSX 
    <div className='rooms home'>
      <div className='rooms__continer home__container'>
        
      </div>
    </div>
  );
};

export default Rooms;