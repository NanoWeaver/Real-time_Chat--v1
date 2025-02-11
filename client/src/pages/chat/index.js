import './styles.css'; // Импорт стилей
import MessagesArea from './messages-area.js'; // Импорт компонента отображения сообщений  
import SendMessage from './send-message.js'; // Импорт компонента отправки сообщений
import NavigationMessage from './navigation-message.js'

// Определяем компонент Chat
const Chat = ({ userName, room, socket, userLogin, setRoom }) => { // Он принимает три пропса
  return ( // Возвращаемый JSX:
    <div className='connectify'>
        <NavigationMessage socket={socket} userLogin = {userLogin} setRoom = {setRoom} />
        <div className='connectify__chat-area'>
          <MessagesArea socket={socket} userName={userName} room={room}/>
          <SendMessage socket={socket} userName={userName} room={room} userLogin = {userLogin}/>
        </div>
    </div>
  );
};

export default Chat;