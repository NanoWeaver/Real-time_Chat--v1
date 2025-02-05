import './styles.css'; // Импортируем CSS
import { useNavigate } from 'react-router-dom'; // Импортируем хук useNavigate, который позволяет программе перемещать пользователя между различными страницами приложения
import { useRef } from 'react';

// Определяем функциональный компонент Home. Он получает несколько пропсов из App
const Home = ({ 
                userName,
                setUserName,
                userLogin,
                setUserLogin,
                userPassword,
                setUserPassword,
                socket
              }) => { 
  const navigate = useNavigate(); // Создаем функцию ,чтоб перенапровлять пользователя на другую страницу
  const userLoginRef = useRef(null) // Получаем поле с логином пользователя
  const userPasswordRef = useRef(null) // Получаем поле с паролем пользователя

  // Слушаем подтверждение входа с сервера
  socket.on('open_connectify', (data) => {
    setUserName(data.userName);
    setUserLogin(data.userLogin);
    setUserPassword(data.userPassword);
    joinConnectify();
  })
//   const joinRoom = () => { // Функция при клике на кнопку входа в комнату
//     if (room !== '' && username !== '') { // Проверяем чтоб имя и название комнаты были заполнены
//       socket.emit('join_room', { username, room }); // Отправляем событие join-room на сервер , предаем объект с именем и названием комнаты
//     }

// // После переводим пользователя на страницу чата и убираем возможность шагнуть назад с помощью стрелки браузера
//     navigate('/chat', { replace: true });
//   };

  const loginVerification = () => { // Функция при клике на кнопку входа в аккаунт
    socket.emit('login_vertification', { 
      userLogin: userLoginRef.current.value, 
      userPassword: userPasswordRef.current.value
    });
    console.log('Запрос на проверку данных отправлен')
  };

  const joinConnectify = () => { // Перевод в само приложение
    navigate('/chat', { replace: true });
  }

  const joinRegistration = () => { // Перевод в окно регистрации
    navigate('/registration', { replace: true });
  }
      
  return ( // Возвращащем JSX 
    <div className='home'>
      <div className='home__container'>
        <h1 className='home__heading'>Вход в Connectify</h1>
        <p className='home__subtitle'>Укажите свои данные</p>
        <input className='home__input' placeholder='Логин пользователя' ref={userLoginRef} />
        <input className='home__input' placeholder='Пароль' ref={userPasswordRef}/>
        <select style={{display: 'none'}} className='home__input'>
          <option>-- Select Room --</option>
          <option value='javascript'>JavaScript</option>
          <option value='node'>Node</option>
          <option value='express'>Express</option>
          <option value='react'>React</option>
        </select>
        <button className='home__button' onClick={loginVerification}>Вход</button> 
        <p className='home__subtitle'>Нет аккаунта? <span className='home__link' onClick={joinRegistration}>Регистрация</span>.</p>
      </div>
    </div>
  );
};

export default Home;