import './styles.css'; // Импортируем стили
import { useState, useEffect } from 'react'; // Импорт хуков React

const NavigationMessage = ({ socket }) => { // Определение компонента Massages с одним промтом 
  const [creatingChat, setCreatingChat] = useState(false);

  const showChatCreationForm = () => {
    setCreatingChat(true);
    console.log('Чат создан')
  }

  const createChat = () => {
    setCreatingChat(false);
  }

  const showChatAddForm = () => {
    console.log('Добавлен в чат')
  }

  return ( // Возвращаем JSX
    <div className='navigation-message'>
      <div className='navigation-message__button-wrapper'>
        <button className='navigation-message__button --create-chat' onClick={showChatCreationForm}>Создать чат</button>
        <button className='navigation-message__button --add-chat' onClick={showChatAddForm}>Добавить чат</button>
      </div>
      {
          creatingChat ? (
            <div className='creatingChat'>
              <div className='creatingChat__form'>
                <input className='creatingChat__input' placeholder='Имя чата'/>
                <input className='creatingChat__input' placeholder='Идентификатор чата'/>
                <button className='creatingChat__button' onClick={createChat}>Создать</button>
                <button className='creatingChat__button --cancellation' onClick={createChat}>Отмена</button>
              </div>
            </div>
          ) : (
            <div>
              АЫЫЫЫЫЫЫЫЫЫ
            </div>
          )
        }
    </div>
  );
};

export default NavigationMessage;