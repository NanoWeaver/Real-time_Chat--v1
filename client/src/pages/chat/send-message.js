import styles from './styles.module.css'; // Импорт стилей
import React, { useState } from 'react'; //Импорт библиотеки и хука

// Определяем компонент SendMessage с тремя пропсами
const SendMessage = ({ socket, username, room }) => { 
  const [message, setMessage] = useState(''); // Создаём состояние для вводимого сообщения

  // Функция для отправки сообщения
  const sendMessage = () => {  // При клике Отправить сообщение
    if (message !== '') { // Проверяем не пустое ли оно
      const createdtime = Date.now(); // Сохраняем время отправки
      //Отпрявляем сообщение на сервер в виде объекта 
      socket.emit('send_message', { username, room, message, createdtime });
      setMessage(''); // Сбрасываем состояние на пустую строку
    }
  };

  return ( // Возврат JSX-разметки
    <div className={styles.sendMessageContainer}>
      <input
        className={styles.messageInput}
        placeholder='Message...'
        onChange={(e) => setMessage(e.target.value)} // Обновление состояние при вводе текста
        value={message}
      />
      <button className='btn btn-primary' onClick={sendMessage}>
        Отправить сообщение
      </button>
    </div>
  );
};

export default SendMessage;