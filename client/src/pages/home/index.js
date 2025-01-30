import './styles.css'; // Импортируем CSS
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

  const joinRegistration = () => {
    navigate('/registration', { replace: true });
  }
      
  return ( // Возвращащем JSX 
    <div className='home'>
      <div className='home__container'>
        <h1 className='home__heading'>Вход в Connectify</h1>
        <p className='home__subtitle'>Укажите свои данные</p>
        <input className='home__input' placeholder='Логин пользователя'  onChange={(e) => setUsername(e.target.value)}/>
        <input className='home__input' placeholder='Пароль'  />
        <select className='home__input' onChange={(e) => setRoom(e.target.value)}>
          <option>-- Select Room --</option>
          <option value='javascript'>JavaScript</option>
          <option value='node'>Node</option>
          <option value='express'>Express</option>
          <option value='react'>React</option>
        </select>
        <button className='home__button' onClick={joinRoom}>Вход</button> 
        <p>Нет аккаунта? <span onClick={joinRegistration}>Регистрация</span>.</p>
      </div>
    </div>
  );
};

export default Home;