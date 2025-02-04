import './styles.css'; // Импортируем стили
import { useState, useEffect } from 'react'; // Импорт хуков React

const Message = ({ socket }) => { // Определение компонента Massages с одним промтом 
  // // Объявляем состояние , начальное значение - пустой массив
  // const [messagesRecieved, setMessagesReceived] = useState([]);

  // // Запускается всякий раз, когда с сервера поступает событие сокета
  // useEffect(() => {
  //   socket.on('receive_message', (data) => { // Устанавливаем слушатель события
  //     console.log(data);
  //     setMessagesReceived((state) => [ // Обновляем состояние , добавляя объект
  //       ...state,
  //       {
  //         message: data.message,
  //         username: data.username,
  //         createdtime: data.createdtime,
  //       },
  //     ]);
  //   });

	// // Remove event listener on component unmount
  //   return () => socket.off('receive_message'); // Удаляем слушатель события 
  // }, [socket]);

  // // Возвращает строку с временем, отформатированную в соответствии с локальными настройками
  // function formatDateFromTimestamp(timestamp) {
  //   const date = new Date(timestamp);
  //   return date.toLocaleString();
  // }

  return ( // Возвращаем JSX
    <div className='message'>
        <p className='message__text'></p>
    </div>
  );
};

export default Message;