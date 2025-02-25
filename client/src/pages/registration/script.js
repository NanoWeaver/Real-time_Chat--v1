import { db } from '../../firebase.js';
import {updateDoc, doc} from "firebase/firestore";
import { supabase } from '../../supabase.js';
import axios from 'axios';
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";


// Функция поиска пользователя в базе данных
export async function userSearchDatabase(userLogin) {
        // Получаем нашу колекцию пользователей
        const usersCollection = await collection(db, "users");
        // Формируем запрос к бд , где будет искать соответствия userLogin
        const request = await query(usersCollection, where("userLogin", "==", userLogin));
        // Получаем объект с результатами запроса
        const userSnapshot = await getDocs(request);
        // Получаем массив с объектом пользователя
        const userList = userSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        // Проверяем нашёлся ли пользователь
        if(userList.length >= 1) {
            console.log('Пользователь с таким логином найден')
            return userList[0]
        } {
            console.log('Логин не найден')
            return false
        }
}

// Функция проверки соответсвия пароля пользователя
export async function verifyinUserPassword(userObject,userPassword) {
    if (userObject.userPassword === userPassword) {
        console.log('Данные верны!');
        return true
    } else {
        console.log('Пароль не верный!');
        return false
    }
}

// Функция регистрации пользователя и добавления его в базу данных
export async function registerUser(userName, userLogin, userPassword,userAvatar = 'https://ojxpknhoadkcobbkrspm.supabase.co/storage/v1/object/public/avatars//userIcon.webp') {
    try {
        const userDoc = await addDoc(collection(db, "users"), {
            userName: userName,
            userLogin: userLogin,
            userPassword: userPassword,
            userAvatar: userAvatar,
            userRooms : []
        });
        console.log("Пользователь зарегистрирован с ID:",  userDoc.id);
    } catch (e) {
        console.error("Ошибка регистрации пользователя:", e);
    }
}

// Функция загрузки изображения в Supabase
export async function uploadImage(fileBlob) {
  if (!fileBlob) return;

  const file = new File([fileBlob], 'avatar.jpg', {
    type: "image/*", // MIME-тип (например, "image/jpeg")
  });

  // Генерируем уникальное имя файла
  const fileName = `avatar_${Date.now()}_${file.name}`;

  // Загружаем файл в Supabase Storage
  const { data, error } = await supabase.storage
  .from('avatars')
  .upload(fileName, file);

  if (error) {
    console.error('Ошибка загрузки аватарки:', error);
    return;
  }

  // Получаем публичный URL
  const { data: publicUrl } = await supabase.storage
  .from('avatars')
  .getPublicUrl(data.path);

  return publicUrl.publicUrl
};

// Функция изминения аватарки пользователя
export async function userAvatarChanging(userLogin,avatarURL) {
    // Получаем пользователя
    console.log('Меняем аватарку для пользователя с логином :' + userLogin)
    const userDoc = await userSearchDatabase(userLogin);
    // Получаем ссылку на документ пользователя
    const userRef = doc(db, 'users', userDoc.id);
    await updateDoc(userRef, {
        userAvatar : avatarURL
    })
}