import { db } from '../../firebase.js';
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
export async function registerUser(userName, userLogin, userPassword) {
    try {
        const userDoc = await addDoc(collection(db, "users"), {
            userName: userName,
            userLogin: userLogin,
            userPassword: userPassword,
            userRooms : []
        });
        console.log("Пользователь зарегистрирован с ID:",  userDoc.id);
    } catch (e) {
        console.error("Ошибка регистрации пользователя:", e);
    }
}