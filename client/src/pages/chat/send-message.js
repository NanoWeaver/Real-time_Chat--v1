import './styles.css'; // Импорт стилей
import React, { useState } from 'react'; //Импорт библиотеки и хука

// Определяем компонент SendMessage с тремя пропсами
const SendMessage = ({ socket, userName, userLogin, room, userAvatar }) => { 
  const [message, setMessage] = useState(''); // Создаём состояние для вводимого сообщения
  
  // Функция для отправки сообщения
  const sendMessage = () => {  // При клике Отправить сообщение
    console.log(userName)
    if (message !== '') { // Проверяем не пустое ли оно
      const createdtime = Date.now(); // Сохраняем время отправки
      //Отпрявляем сообщение на сервер в виде объекта 
      console.log('Отпрявляем сообщение на сервер в виде объекта ', { userName, room, message, userLogin, createdtime, userAvatar })
      socket.emit('send_message', { userName, room, message, userLogin, createdtime, userAvatar });
      setMessage(''); // Сбрасываем состояние на пустую строку
    }
    console.log('Отпраили сообщение от ' + 'Логин пользователя ' + userLogin + '. Имя пользователя ' + userName)
  };

  const sendLogin = () => {
    console.log('Аватарка пользователя в компоненте send-message : ' + userAvatar)
  }

  return ( // Возврат JSX-разметки
    <div className='send-message'>
      <input
        className='send-message__message-input'
        placeholder='Message...'
        onChange={(e) => setMessage(e.target.value)} // Обновление состояние при вводе текста
        value={message}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            sendMessage();
          }
        }}
      />
      <button className='send-message__message-button' onClick={sendMessage}>
        Отправить сообщение
      </button>
    </div>
  );
};

export default SendMessage;