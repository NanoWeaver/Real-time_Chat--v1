import './App.css'; // Ипорт стилей для приложения
import { useState, useEffect } from 'react'; // Импорт хука useState
import Home from './pages/home/index.js'; // Импорт компонента Home для отображения на главное странице
import Chat from './pages/chat/index.js'; // Импорт компонента Chat, который будет отображаться на странице чата
import Registr from './pages/registration/index.js'; // Импорт компонента Registr, который будет отображаться на странице регистрации
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // импортируем необходимые компоненты из библиотеки React Router для организации маршрутизации
import io from 'socket.io-client'; // Импорт библиотеки Socket.IO для создания WebSocket-соединений

const socket = io.connect('http://localhost:4000'); // Устанавливаем соединение с сервером на локальном хосте 4000

function App() { // Oпределение функционального компонента App
  const [userName, setUserName] = useState(''); // Cоздание состояния username, которое будет хранить имя пользователя. setUsername — функция, которая позволяет обновлять это состояние
  const [room, setRoom] = useState(''); // Cоздание состояния room, которое будет хранить объект комнаты чата, setRoom — функция для его обновления
  const [userLogin, setUserLogin] = useState(''); // Cоздание состояния userLogin, которое будет хранить имя пользователя, setUserLogin — функция для его обновления
  const [userPassword, setUserPassword] = useState(''); // Cоздание состояния userPassword, которое будет хранить пароль пользователя, setUserPassword — функция для его обновления
  const [userAvatar, setUserAvatar] = useState(''); // Создание состояние userAvatar которое будет хранить сслку на аватар пользователя
  const [isLoading, setIsLoading] = useState(true); // Индикация загружены ли все данные пользователя

   // Загружаем данные из localStorage при монтировании
  useEffect(() => {
    const savedUserName = localStorage.getItem('userName');
    const savedUserLogin = localStorage.getItem('userLogin');
    const savedUserPassword = localStorage.getItem('userPassword');
    const savedRoom = localStorage.getItem('room');
    const savedAvatar = localStorage.getItem('userAvatar')

    if (savedUserName) setUserName(savedUserName);
    if (savedUserLogin) setUserLogin(savedUserLogin);
    if (savedUserPassword) setUserPassword(savedUserPassword);
    if (savedRoom) setRoom(savedRoom);
    if (savedAvatar) setUserAvatar(savedAvatar)

    setIsLoading(false);
  }, []);

  // Сохраняем данные в localStorage при изменении состояния
  useEffect(() => {
    localStorage.setItem('userName', userName);
    localStorage.setItem('userLogin', userLogin);
    localStorage.setItem('userPassword', userPassword);
    localStorage.setItem('room', room);
    localStorage.setItem('userAvatar', userAvatar)
  }, [userName, userLogin, userPassword, room, userAvatar]);


  if (isLoading) return <div>Загрузка...</div>; // Пока данные не загружены 

  return ( // Настройка маршрутизации 
    <Router>
      <div className='App'>
        <Routes>
          <Route
            path='/'
            element={
              <Home
                userName = {userName}
                setUserName = {setUserName}
                userLogin = {userLogin}
                setUserLogin = {setUserLogin}
                userPassword = {userPassword}
                setUserPassword = {setUserPassword}
                socket = {socket}
                setUserAvatar = {setUserAvatar}
              />
            }
          />
          {/* Add this */}
          <Route
            path='/chat'
            element={
                <Chat 
                userName = {userName}
                setUserName = {setUserName}
                userLogin = {userLogin}
                userPassword = {userPassword}
                setUserPassword = {setUserPassword}
                room = {room} 
                setRoom = {setRoom}
                socket = {socket}
                setUserAvatar = {setUserAvatar}
                userAvatar = {userAvatar}
                setUserLogin = {setUserLogin}
              />}
          />
          <Route
            path='/registration'
            element={<Registr socket={socket} setUserAvatar = {setUserAvatar} userAvatar={userAvatar} setUserLogin={setUserLogin} userLogin={userLogin}/>}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App; // Экспорт компонента
