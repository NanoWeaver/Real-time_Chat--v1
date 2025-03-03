import { db } from '../../firebase.js';
import {updateDoc, doc, setDoc} from "firebase/firestore";
import { supabase } from '../../supabase.js';
import axios from 'axios';
import { collection, getDocs, getDoc, addDoc, query, where } from "firebase/firestore";


// Функция поиска пользователя в базе данных по логину
export async function userSearchDatabaseLogin(userLogin) {
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

// Функция поиска пользователя в базе данных по ID
export async function userSearchDatabaseID(userID) {
    const userRef = doc(db, 'users', userID);
    try {
        const userSnap = await getDoc(userRef)
        if(userSnap.exists()) {
            console.log('Пользователь найден ' ,userSnap.data());
            return userSnap.data()
        } else {
            console.log('Пользователь не найден')
        }
    
    } catch(error) {
        console.log('Ошибка ' ,error)
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
        const userDoc = await addDoc(collection(db, "users"), { // Создаём объект пользователя
            userName: userName,
            userLogin: userLogin,
            userPassword: userPassword,
            userAvatar: userAvatar,
            userAbout: '',
            userRooms : [],
        });
        const userRef = doc(db, 'users', userDoc.id); // Получаем ссылку на этот объект
        await updateDoc(userRef, { // Добавляем пользователю его уникальный ID
            userID : userDoc.id,
        })
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
    const userDoc = await userSearchDatabaseLogin(userLogin);
    // Получаем ссылку на документ пользователя
    const userRef = doc(db, 'users', userDoc.id);
    await updateDoc(userRef, {
        userAvatar : avatarURL
    })
}

// Функция получения имени и логина пользователя по ID
export async function gettingUserDataId(userID) {
    const userDoc = await userSearchDatabaseID(userID);
    return [userDoc.userName, userDoc.userLogin];
}

// Функция изминения имени пользователя 
export async function userNameChanging(userID, userNewName) {
    // Получаем ссылку на пользователя
    const userRef = doc(db, 'users', userID);
    // Меняем данные
    await updateDoc(userRef, {
        userName : userNewName,
    })
}

// Функция изминения логина пользователя 
export async function userLoginChanging(userID, userNewLogin) {
    // Получаем ссылку на пользователя
    const userRef = doc(db, 'users', userID);
    // Меняем данные
    await updateDoc(userRef, {
        userLogin : userNewLogin,
    })
}