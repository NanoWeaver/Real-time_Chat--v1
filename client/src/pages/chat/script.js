import { db } from '../../firebase.js';
import { collection, getDocs, addDoc, query, where, updateDoc, doc } from "firebase/firestore";
import {userSearchDatabase} from '../registration/script.js'

// Функция поиска комнаты в базе данных
export async function roomSearchDatabase(roomLogin) {
    // Получаем нашу колекцию комнат
    const roomsCollection = await collection(db, "rooms");
    // Формируем запрос к бд , где будет искать соответствия roomLogin
    const request = await query(roomsCollection, where("roomLogin", "==", roomLogin));
    // Получаем объект с результатами запроса
    const roomSnapshot = await getDocs(request);
    // Получаем массив с объектом комнаты
    const roomList = roomSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Проверяем есть ли такая комната
    if(roomList.length >= 1) {
        console.log('Комната с таким логином найдена')
        return roomList[0]
    } {
        console.log('Комната не найден')
        return false
    }
}

// Функция регеистрации комнаты и добавления её в базу данных
export async function registerRoom(roomName, roomLogin) {
    try {
        const roomDoc = await addDoc(collection(db, "rooms"), {
            roomName: roomName,
            roomLogin: roomLogin,
            roomUsers: []
        });
        console.log("Комната создана с ID:",  roomDoc.id);
    } catch (e) {
        console.error("Ошибка создания комнаты:", e);
    }
}

// Фунция добавления новой комнаты в объект пользователя
export async function addingRoomUser(userLogin, roomLogin) {
    // Получаем пользователя
    const userDoc = await userSearchDatabase(userLogin);
    console.log(userDoc)
    // Добавляем комнату в общий массив
    const userRoomsNew = userDoc.userRooms;
    userRoomsNew.push(roomLogin)
    // Получаем ссылку на документ пользователя
    const userRef = doc(db, 'users', userDoc.id);
    await updateDoc(userRef, {
        userRooms : userRoomsNew
    })
}

// Фунция добавления нового пользователя в объект комнаты
export async function addingUserRoom(userLogin, roomLogin) {
    // Получаем комнату
    const roomDoc = await roomSearchDatabase(roomLogin);
    console.log(roomDoc)
    // Добавляем пользователя в общий массив
    const roomUsersNew = roomDoc.roomUsers;
    roomUsersNew.push(userLogin)
    // Получаем ссылку на документ комнаты
    const roomRef = doc(db, 'rooms', roomDoc.id);
    await updateDoc(roomRef, {
        roomUsers : roomUsersNew
    })
}

// Функция получения списка комнат пользователя
export async function getUserRooms(userLogin) {
    // Получаем пользователя
    const userDoc = await userSearchDatabase(userLogin);
    // Получаем его список чатов
    const userRooms = userDoc.userRooms || [];
    return userRooms
}