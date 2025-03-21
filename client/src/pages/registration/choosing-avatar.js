import './styles.css'; // Импорт стилей
import {uploadImage, userAvatarChanging} from './script.js'
import { useRef, useState } from 'react'; // Импорт реакт хуков
import Cropper from 'react-cropper'; // Импорт библиотеки для обрезки фото пользователя
import 'cropperjs/dist/cropper.css';

const ChoosingAvatar = ({setUserAvatar, userLogin, userAvatar , setButtonCancel = () => {}, setRoomAvatarURL = () => {}, itsRoom = false}) => {
  const [draggingActive, setDraggingActive] = useState(false); // Создаём состояние для флага начал ли пользователь тащить изображение
  const [selectedFile, setSelectedFile] = useState(null); // Состояние для хранения выбраного изображения
  const [croppedImage, setCroppedImage] = useState(null); // Состояние для хранения обрезанного изображения
  const cropperRef = useRef(null);


  // Обработчик выбора файла
  const handleFileSelect = (file) => {
    if (file && file.type.match('image.*')) {
      setSelectedFile(file); // Если это фото то сохроняем его
      setButtonCancel(false)
    }
  };

  // Drag and Drop обработчики
  const handleDragOver = (e) => {
    e.preventDefault();
    setDraggingActive(true); // Над блоком что-то тащат
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDraggingActive(false); // Перестали тащить над блоком
  };

  const handleDrop = (e) => { // Что-то сбросили в блок
    e.preventDefault();
    setDraggingActive(false);
    const file = e.dataTransfer.files[0];
    handleFileSelect(file); // Проверяем фото ли это
  };

  // Обрезка изображения
  const getCroppedImage = () => {
    if (cropperRef.current) { //  Получает текущий экземпляр Cropper через ссылку
      cropperRef.current.cropper // Обращается к внутреннему API Cropper
        .getCroppedCanvas() // Создаёт HTML-элемент <canvas> с обрезанным изображением.
        .toBlob((blob) => { // Конвертирует содержимое <canvas> в объект Blob
          setCroppedImage(blob); // Сохраняет обрезанное изображение в состоянии React
          console.log('Это бинарный файл изображения' , blob)
        });
    }
  };

  // Функция сохранения изображения в фотохостинге и профиле пользователя
  const sendCroppedImage = async () => {
    if (itsRoom) {
      console.log('Это блок для возврата URL ')
      setRoomAvatarURL(await uploadImage(croppedImage));
    } else {
      console.log('Значение переменной itsRoom ' + itsRoom)
      console.log('Изображение ушло на сервер')
      console.log('Это бинарный файл изображения' , croppedImage)
      const avatar = await uploadImage(croppedImage); // Сохраняем ссылку на аватарку пользователя
      setUserAvatar(avatar);
      console.log('Меняем аватарку для пользователя с логином :' + userLogin)
      console.log('На аватарку с адресом URL :' + avatar)
      await userAvatarChanging(userLogin, avatar)
      console.log('Значение внутри  userAvatar:' + userAvatar)
    }
  }

  // Отмена выбора
  const handleCancel = () => {
    setSelectedFile(null);
    setButtonCancel(true)
    setCroppedImage(null);
  };

  return (
    <div className='choosing-avatar__wrapper'>
      
      {!selectedFile ? (
        <div 
          className={`avatar__wrapper ${draggingActive ? 'avatar__wrapper--dragover' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input 
            className="avatar__input" 
            type="file" 
            id="file-input" 
            accept="image/png, image/jpeg"
            onChange={(e) => handleFileSelect(e.target.files[0])}
          />
          <label className="avatar__label" htmlFor="file-input">
            Выберите файл
          </label>
          <span className="avatar__sub-title">или перетащите его сюда</span>
        </div>
      ) : ( !croppedImage ? (
        <div className="cropper-container">
          <Cropper
            ref={cropperRef} // Получаем ссылку на DOM экземпляр
            src={URL.createObjectURL(selectedFile)} // Передаём картинку
            aspectRatio={1} // Соотношение сторон для шаблона обрезки
            viewMode={1} // Можно ли перетаскивать изображение (1 - нет)
            guides={true} // Направляющие линии для обрезки
            minCropBoxWidth={100} // Мин область для обрезки в px
            minCropBoxHeight={100} // Мин область для обрезки в px
            responsive={true} // Изменение размеров Cropper при уменьшении контейнера
            autoCropArea={1} // Какая часть изображения будет автоматически выделена для обрезки
            checkOrientation = {false} // Отключает проверку ориентации изображения
          />
        </div>
      ) : (
        <img className='avatar__preview' src={URL.createObjectURL(croppedImage)} alt="Обрезанное изображение"/>
      )
      )}

      <div className="buttons-wrapper">
        <button 
          className='home__button --primary-button' 
          onClick={!croppedImage ? getCroppedImage : sendCroppedImage}
          disabled={!selectedFile}
        >
          {croppedImage ? 'Загрузить' : 'Обрезать'}
        </button>

        {selectedFile && (
          <button 
            className='home__button --secondary-button'
            onClick={handleCancel}
          >
            Отмена
          </button>
        )}
      </div>
    </div>
  );
};

export default ChoosingAvatar;