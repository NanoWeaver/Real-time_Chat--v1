import './styles.css'; // Импортируем стили
import { useState, useEffect } from 'react'; // Импорт хуков React
import {getMessagesRoom} from '../chat/script.js'

const MessagesArea = ({ socket, userName, room }) => { // Определение компонента Massages с одним промтом 
  const [messagesReceived, setMessagesReceived] = useState([]); // Определяем состояние для хранения сообщений

  // Загрузка истории чата 
  useEffect(() => {
    socket.on('loading_message_history', async (data) => {
      console.log('Загружаем историю чата из комнаты ' + data.roomName)
      const massagesList = await getMessagesRoom(data.roomLogin);
      console.log('Массив объектов сообщений для этой комнаты:', massagesList)
      setMessagesReceived(massagesList.reverse())
    })
  })

  // Чистим область сообщений при смене чата
  useEffect(() => {
    setMessagesReceived([]);
  },[room])

  // Принятие сообщения с сервера и его отображение
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
      <h1>{room.roomName}</h1>
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