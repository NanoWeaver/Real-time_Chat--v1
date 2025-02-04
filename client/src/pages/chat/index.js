import './styles.css'; // Импорт стилей
import MessagesArea from './messages-area.js'; // Импорт компонента отображения сообщений  
import SendMessage from './send-message.js'; // Импорт компонента отправки сообщений
import NavigationMessage from './navigation-message.js'

// Определяем компонент Chat
const Chat = ({ username, room, socket }) => { // Он принимает три пропса
  return ( // Возвращаемый JSX:
    <div className='connectify'>
        <NavigationMessage socket={socket} />
        <div className='connectify__chat-area'>
          <MessagesArea socket={socket} />
          <SendMessage socket={socket} username={username} room={room} />
        </div>
    </div>
  );
};

export default Chat;