import './styles.css'; // Импортируем стили
import { useState, useEffect } from 'react'; // Импорт хуков React

const MessagesArea = ({ socket, userName }) => { // Определение компонента Massages с одним промтом 
  const [messagesReceived, setMessagesReceived] = useState([]); // Определяем состояние

  useEffect(() => {
    
    socket.on('receive_message', (data) => { // Обрабатывем сообщение с сервера
      console.log('Отобразили сообщение от пользователя с ником ' + userName)
      setMessagesReceived((prev) => [
        ...prev,
        {
          message: data.message,
          userName: data.userName,
          createdtime: data.createdtime,
        },
      ]);
    });
    console.log('Приняли и отобразили сообщение пользователя в чате ' )
  
    return () => {
      socket.off('receive_message'); // Отписываемся от события при размонтировании
    };
  }, [socket]);

  return ( // Возвращаем JSX
    <div className='messages-area'>
    {messagesReceived.map((msg, i) => (
      <div key={i} className='message'>
        <div>
          <span>{msg.userName} </span> <span>{new Date(msg.createdtime).toLocaleString()}</span>
        </div>
        <p>{msg.message}</p>
      </div>
    ))}
  </div>
  );
};

export default MessagesArea;