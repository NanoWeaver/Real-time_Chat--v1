import './App.css'; // Ипорт стилей для приложения
import { useState } from 'react'; // Импорт хука useState
import Home from './pages/home'; // Импорт компонента Home для отображения на главное странице
import Chat from './pages/chat'; // Импорт компонента Chat, который будет отображаться на странице чата
import Registr from './pages/registration'; // Импорт компонента Registr, который будет отображаться на странице регистрации
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // импортируем необходимые компоненты из библиотеки React Router для организации маршрутизации
import io from 'socket.io-client'; // Импорт библиотеки Socket.IO для создания WebSocket-соединений

const socket = io.connect('http://localhost:4000'); // Устанавливаем соединение с сервером на локальном хосте 4000

function App() { // Oпределение функционального компонента App
  const [username, setUsername] = useState(''); // Cоздание состояния username, которое будет хранить имя пользователя. setUsername — функция, которая позволяет обновлять это состояние
  const [room, setRoom] = useState(''); // Cоздание состояния room, которое будет хранить имя комнаты чата, setRoom — функция для его обновления

  return ( // Настройка маршрутизации 
    <Router>
      <div className='App'>
        <Routes>
          <Route
            path='/'
            element={
              <Home
                username={username}
                setUsername={setUsername}
                room={room}
                setRoom={setRoom}
                socket={socket}
              />
            }
          />
          {/* Add this */}
          <Route
            path='/chat'
            element={<Chat username={username} room={room} socket={socket} />}
          />
          <Route
            path='/registration'
            element={<Registr/>}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App; // Экспорт компонента
