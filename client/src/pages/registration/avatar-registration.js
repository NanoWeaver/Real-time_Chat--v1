import './styles.css'; // Импорт стилей
import { useRef, useState } from 'react';
const AvatarRegistration = ({}) => { // Компонент загрузки аватара пользователя при регистрации
    const [draggingActive,setDragginActive] = useState(false);

    const handleDragOver = () => {
        setDragginActive(true)
    }

    const handleDragOverOff = () => {
        setDragginActive(false)
    }

    return (  // Возвращаем JSX
          <div className='home__container'>
            <h1 className='home__heading'>Регистрация в Connectify</h1>
            <p className='home__subtitle'>Настройте свой профиль:<br/>выберите любимую аватарку!</p>
            <div className={`avatar__wrapper ${draggingActive ? `avatar__wrapper--dragover` : null}`} onDragOver={handleDragOver} onDragLeave={handleDragOverOff}>
                <input className="avatar__input"  type="file" id="file-input" accept="image/png, image/jpeg" />
                <label className="avatar__label" for="file-input">Выберите файл </label>
                <span className="avatar__sub-title">или перетащите его сюда</span>
            </div>
            <button className='home__button --secondary-button'>Загрузить</button> 
            <p className='home__subtitle'>Есть аккаунт? <span className='home__link'>Вход</span>.</p>
          </div>
    )
}

export default AvatarRegistration