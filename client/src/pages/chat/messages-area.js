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
      <div className='messages-area__head'>
        <img className='messages-area__logo' src='/images/userIcon.webp' alt='Иконка пользователя' width={42} height={42}/>
        <h1 className='messages-area__heading'>{room.roomName}</h1>
        <button className='messages-area__option'>
        <svg className='messages-area__option-svg' width="5" height="20" viewBox="0 0 5 20" xmlns="http://www.w3.org/2000/svg">
          <circle cx="2.5" cy="17.5" r="2" />
          <circle cx="2.5" cy="10" r="2"/>
          <circle cx="2.5" cy="2.5" r="2" />
        </svg>
        </button>
      </div>
      <div className='messages-area__content'>
        {messagesReceived.map((msg, i) => (
        <div key={i} className='message__wrapper'>
          <div>
            <span>{msg.userName} </span> <span>{new Date(msg.createdtime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <p>{msg.message}</p>
        </div>
      ))}
      </div>
  </div>
  );
};

export default MessagesArea;