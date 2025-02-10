import './styles.css'; // Импорт стилей
import React, { useState } from 'react'; //Импорт библиотеки и хука

// Определяем компонент SendMessage с тремя пропсами
const SendMessage = ({ socket, userName, room }) => { 
  const [message, setMessage] = useState(''); // Создаём состояние для вводимого сообщения

  // Функция для отправки сообщения
  const sendMessage = () => {  // При клике Отправить сообщение
    console.log(userName)
    if (message !== '') { // Проверяем не пустое ли оно
      const createdtime = Date.now(); // Сохраняем время отправки
      //Отпрявляем сообщение на сервер в виде объекта 
      socket.emit('send_message', { userName, room, message, createdtime });
      setMessage(''); // Сбрасываем состояние на пустую строку
    }
  };

  return ( // Возврат JSX-разметки
    <div className='send-message'>
      <input
        className='send-message__message-input'
        placeholder='Message...'
        onChange={(e) => setMessage(e.target.value)} // Обновление состояние при вводе текста
        value={message}
      />
      <button className='send-message__message-button' onClick={sendMessage}>
        Отправить сообщение
      </button>
    </div>
  );
};

export default SendMessage;