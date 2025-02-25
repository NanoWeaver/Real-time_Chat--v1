import './styles.css'; // Импортируем стили
import { useState, useEffect, useRef } from 'react'; // Импорт хуков React
import {getMessagesRoom} from '../chat/script.js'

const MessagesArea = ({ socket, userName, userLogin, room }) => { // Определение компонента Massages с одним промтом 
  const [messagesReceived, setMessagesReceived] = useState([]); // Определяем состояние для хранения сообщений
  const messagesEndRef = useRef(); // Будем получать ссылку на DOM последнего сообщения
  const [numberUsers,setNumberUsers] = useState(0);

  // Прокрутка чата до последнего сообщения 
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [messagesReceived]);

  useEffect(() => {
    setNumberUsers(room.roomUsers?.length)
    console.log(' Колличесвто пользователей в комнате = ' ,numberUsers)
  }, [room])


  // Загрузка истории чата 
  useEffect(() => {
    socket.on('loading_message_history', async (data) => {
      console.log('Загружаем историю чата из комнаты ' + data.roomName)
      console.log('Логин пользователя в конмпоненте messages-area :' + userLogin)
      const massagesList = await getMessagesRoom(data.roomLogin);
      console.log('Массив объектов сообщений для этой комнаты:', massagesList)
      // Перебираем объекты сообщений для маркировки по типо От пользователя или Нет
      const massagesListFinal = massagesList.map(msg => {
        console.log('Переделываем объект сообщения и определяес значение isCurrentUser')
        console.log('Логин отправителя = ' + msg.userLogin + ' А логин текущего пользователя ' + userLogin)
        return {
          ...msg,
          isCurrentUser: msg.userLogin === userLogin
        }
      })
      setMessagesReceived(massagesListFinal.reverse())
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
      const isCurrentUser = data.userLogin === userLogin // Кто автор сообщения пользователь или нет
      setMessagesReceived((prev) => [
        ...prev,
        {
          message: data.message,
          userName: data.userName,
          userAvatar: data.userAvatar,
          createdtime: data.createdtime,
          isCurrentUser
        },
      ]);
      console.log('Приняли и отобразили сообщение пользователя в чате')
      console.log('Логин пользователя ' + userLogin + '. Имя пользователя ' + userName)
      console.log('ID сообщения ' , data)
    });
    
    return () => {
      socket.off('receive_message'); // Отписываемся от события при размонтировании
    };
  }, [socket]);

  return ( // Возвращаем JSX
    <div className='messages-area'>
      <div className='messages-area__head'>
        <img className='messages-area__logo' src='/images/userIcon.webp' alt='Иконка пользователя' width={42} height={42}/>
        <div className='messages-area__info-wrapper'>
          <h1 className='messages-area__heading'>{room.roomName}</h1>
          <span className='messages-area__number-users'>{numberUsers} участников</span>
        </div>
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
        <div  key={msg.createdtime} ref={messagesEndRef} className={`message__box message__box--${msg.isCurrentUser ? 'you' : 'they'}`}>
          <div key={i} className={`message__wrapper message__wrapper--${msg.isCurrentUser ? 'you' : 'they'}`}>
          <div className='message__head'>
            <img className='message__user-avatar' src={msg.userAvatar} width={45} height={45}/>
            <span className='message__user-name'>{msg.userName} </span> <span className='message__time'>{new Date(msg.createdtime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <p className='message__text'>{msg.message}</p>
        </div>
        </div>
      ))}
      </div>
  </div>
  );
};

export default MessagesArea;