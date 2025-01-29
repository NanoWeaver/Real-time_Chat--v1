import styles from './styles.module.css'; // Импортируем CSS-модуль
import { useNavigate } from 'react-router-dom'; // Импортируем хук useNavigate, который позволяет программе перемещать пользователя между различными страницами приложения

// Определяем функциональный компонент Home. Он получает несколько пропсов из App
const Home = ({ username, setUsername, room, setRoom, socket }) => { 
  const navigate = useNavigate(); // Создаем функцию ,чтоб перенапровлять пользователя на другую страницу

  const joinRoom = () => { // Функция при клике на кнопку входа в комнату
    if (room !== '' && username !== '') { // Проверяем чтоб имя и название комнаты были заполнены
      socket.emit('join_room', { username, room }); // Отправляем событие join-room на сервер , предаем объект с именем и названием комнаты
    }

// После переводим пользователя на страницу чата и убираем возможность шагнуть назад с помощью стрелки браузера
    navigate('/chat', { replace: true });
  };
      
  return ( // Возвращащем JSX 
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h1>{`<>DevRooms</>`}</h1>
        <input className={styles.input} placeholder='Username...'  onChange={(e) => setUsername(e.target.value)}/> // Обновляет состояне имени пользователя

        <select className={styles.input} onChange={(e) => setRoom(e.target.value)}> // Обновляет состояне комнаты
          <option>-- Select Room --</option>
          <option value='javascript'>JavaScript</option>
          <option value='node'>Node</option>
          <option value='express'>Express</option>
          <option value='react'>React</option>
        </select>

        <button className='btn btn-secondary' style={{ width: '100%' }} onClick={joinRoom}>Join Room</button>
      </div>
    </div>
  );
};

export default Home;