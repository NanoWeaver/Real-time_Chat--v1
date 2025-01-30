import styles from './styles.module.css'; // Импортируем стили
import { useState, useEffect } from 'react'; // Импорт хуков React

const Messages = ({ socket }) => { // Определение компонента Massages с одним промтом 
  // Объявляем состояние , начальное значение - пустой массив
  const [messagesRecieved, setMessagesReceived] = useState([]);

  // Запускается всякий раз, когда с сервера поступает событие сокета
  useEffect(() => {
    socket.on('receive_message', (data) => { // Устанавливаем слушатель события
      console.log(data);
      setMessagesReceived((state) => [ // Обновляем состояние , добавляя объект
        ...state,
        {
          message: data.message,
          username: data.username,
          createdtime: data.createdtime,
        },
      ]);
    });

	// Remove event listener on component unmount
    return () => socket.off('receive_message'); // Удаляем слушатель события 
  }, [socket]);

  // Возвращает строку с временем, отформатированную в соответствии с локальными настройками
  function formatDateFromTimestamp(timestamp) {
    const date = new Date(timestamp);
    return date.toLocaleString();
  }

  return ( // Возвращаем JSX
    <div className={styles.messagesColumn}>
      {messagesRecieved.map((msg, i) => (
        <div className={styles.message} key={i}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span className={styles.msgMeta}>{msg.username}</span>
            <span className={styles.msgMeta}>
              {formatDateFromTimestamp(msg.createdtime)}
            </span>
          </div>
          <p className={styles.msgText}>{msg.message}</p>
          <br />
        </div>
      ))}
    </div>
  );
};

export default Messages;