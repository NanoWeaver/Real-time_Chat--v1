import styles from './styles.module.css'; // Импорт стилей
import MessagesReceived from './messages'; // Импорт компонента отображения сообщений  
import SendMessage from './send-message'; // Импорт компонента отправки сообщений

// Определяем компонент Chat
const Chat = ({ username, room, socket }) => { // Он принимает три пропса
  return ( // Возвращаемый JSX:
    <div className={styles.chatContainer}>
      <div>
        <MessagesReceived socket={socket} />
        <SendMessage socket={socket} username={username} room={room} />
      </div>
    </div>
  );
};

export default Chat;