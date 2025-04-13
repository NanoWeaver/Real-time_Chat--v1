import { db } from '../../firebase.js';
import { collection, getDocs, getDoc, addDoc, query, where, updateDoc, doc, orderBy } from "firebase/firestore";
import {userSearchDatabaseLogin, userSearchDatabaseID} from '../registration/script.js'

// Функция поиска комнаты в базе данных по логину
export async function roomSearchDatabase(roomLogin) {
    // Получаем нашу колекцию комнат
    const roomsCollection = collection(db, "rooms");
    // Формируем запрос к бд , где будет искать соответствия roomLogin
    const request = query(roomsCollection, where("roomLogin", "==", roomLogin));
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

// Функция поиска комнаты в базе данных по ID 
export async function roomSearchDatabaseID(roomID) {
    const roomRef = doc(db, 'rooms', roomID);
    try {
        const roomSnap = await getDoc(roomRef)
        if(roomSnap.exists()) {
            console.log('Комната найдена ' ,roomSnap.data());
            return roomSnap.data()
        } else {
            console.log('Комната не найдена ')
        }
    
    } catch(error) {
        console.log('Ошибка ' ,error)
    }
}


// Функция регеистрации комнаты и добавления её в базу данных
export async function registerRoom(room) {
    try {
        console.log(room)
        const roomDoc = await addDoc(collection(db, "rooms"), {
            roomName: room.roomName,
            roomLogin: room.roomLogin,
            roomAbout: room.roomAbout,
            roomAdmin: [room.userID,],
            roomAvatar: room.roomAvatar,
            roomUsers: [],
            lastMessage: {
                userSenderName: '',
                createdtime: '',
                message: ''
            }
        });
        const roomRef = doc(db, 'rooms', roomDoc.id); // Получаем ссылку на этот объект
        await updateDoc(roomRef, { // Добавляем пользователю его уникальный ID
            roomID : roomDoc.id,
        })
        console.log("Комната создана с ID:",  roomDoc.id);
        return roomDoc.id
    } catch (e) {
        console.error("Ошибка создания комнаты:", e);
    }
}

// Фунция добавления новой комнаты в объект пользователя
export async function addingRoomUser(userID, roomID) {
    // Получаем пользователя
    const userDoc = await userSearchDatabaseID(userID);
    console.log(userDoc)
    // Добавляем комнату в общий массив
    const userRoomsNew = userDoc.userRooms;
    userRoomsNew.push(roomID)
    // Получаем ссылку на документ пользователя
    const userRef = doc(db, 'users', userID);
    await updateDoc(userRef, {
        userRooms : userRoomsNew
    })
}

// Фунция добавления нового пользователя в объект комнаты
export async function addingUserRoom(userID, roomID) {
    // Получаем комнату
    const roomDoc = await roomSearchDatabaseID(roomID);
    console.log(roomDoc)
    // Добавляем пользователя в общий массив
    const roomUsersNew = roomDoc.roomUsers;
    roomUsersNew.push(userID)
    // Получаем ссылку на документ комнаты
    const roomRef = doc(db, 'rooms', roomID);
    await updateDoc(roomRef, {
        roomUsers : roomUsersNew
    })
}

// Фунция удаления комнаты из объекта пользователя
export async function removingRoomUser(userID, roomID) {
    // Получаем пользователя
    const userDoc = await userSearchDatabaseID(userID);
    console.log(userDoc)
    // Создаём новый массив без удалённой комнаты
    const userRoomsNew = userDoc.userRooms.filter(room => room !== roomID);
    // Получаем ссылку на документ пользователя
    const userRef = doc(db, 'users', userID);
    await updateDoc(userRef, {
        userRooms : userRoomsNew
    })
}

// Фунция удаления пользователя из объекта комнаты
export async function removingUserRoom(userID, roomID) {
    // Получаем комнату
    const roomDoc = await roomSearchDatabaseID(roomID);
    console.log(roomDoc)
    // Создаём новый массив без пользователя
    const roomUsersNew = roomDoc.roomUsers.filter(user => user !== userID);
    // Получаем ссылку на документ комнаты
    const roomRef = doc(db, 'rooms', roomID);
    await updateDoc(roomRef, {
        roomUsers : roomUsersNew
    })
    roomDoc.roomUsers = roomUsersNew;
    return roomDoc
}

// Функция получения списка комнат пользователя
export async function getUserRooms(userID) {
    // Получаем пользователя
    const userDoc = await userSearchDatabaseID(userID);
    // Получаем его список чатов
    const userRooms = userDoc.userRooms || [];
    return userRooms
}

// Функция добавления сообщения в базу данных
export async function addMessage(roomID, roomLogin, message, userID, createdtime, userAvatar) {
    try {
        const messageDoc = await addDoc(collection(db, "messages"), {
            userID,
            userName: '',
            userLogin: '',
            roomLogin, 
            roomID,
            message, 
            createdtime,
            userAvatar, 
        });
        console.log("Сообщение сохранено с ID:",  messageDoc.id);
    } catch (e) {
        console.error("Ошибка сохранения сообщения:", e);
    }
}

// Функция загрузики истории собщений для определённой комнаты
export async function getMessagesRoom(roomID, limit = 20) {
    // Получили колекцию сообщений
    const collectionMessages = collection(db, 'messages');
    // Формируем запрос к бд
    const request = query(collectionMessages, where('roomID', '==', roomID),orderBy('createdtime', 'desc'));
    // Получаем результаты поиска
    const messageSnapshot = await getDocs(request)

  return messageSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}

// Функция изминения данных последнего сообщения в комнате
export async function changingLastMessage(userID, roomID, message, createdtime, roomLogin) {
    // Получаем комнату
    console.log('Получаем комнату для обновления полседнего сообщения с именем ' + roomLogin + 'с текстом ' + message)
    const roomDoc = await roomSearchDatabaseID(roomID);
    // Создаём новый объект последнего сообщения
    const roomLastMessageNew = {
        userSenderID: userID,
        userSenderName: '',
        createdtime,
        message,
    };
    // Получаем ссылку на документ комнаты
    const roomRef = doc(db, 'rooms', roomID);
    // Перезаписываем данные
    await updateDoc(roomRef, {
        lastMessage : roomLastMessageNew
    })

    return roomLastMessageNew;
}

// Функция поиска сообщений
export function searchMessages(searchQuery, messagesReceived) {
    const filtered = messagesReceived
        .filter((msg) =>
            msg.message.toLowerCase().includes(searchQuery.toLowerCase())
        )
    console.log('Не отсортированный массив ' , filtered)
    const filteredSort = filtered.sort((a, b) => b.createdtime - a.createdtime);
    console.log('Отсортированный массив ' , filteredSort)
    return filteredSort;
}

// Функция изминения аватарки групового чата
export async function changingRoomAvatar(roomID, newAvatar) {
    // Получаем ссылку на чат
    const roomRef = await doc(db, 'rooms', roomID);
    // Меняем аватарку
    await updateDoc(roomRef, {
        roomAvatar: newAvatar,
    })
}

// Функция изминения имени групового чата
export async function changingRoomName(roomID, newName) {
    // Получаем ссылку на чат
    const roomRef = await doc(db, 'rooms', roomID);
    // Меняем аватарку
    await updateDoc(roomRef, {
        roomName: newName,
    })
}

// Функция изминения логина групового чата
export async function changingRoomLogin(roomID, newLogin) {
    // Получаем ссылку на чат
    const roomRef = await doc(db, 'rooms', roomID);
    // Меняем аватарку
    await updateDoc(roomRef, {
        roomLogin: newLogin,
    })
}

// Функция изминения описания групового чата
export async function changingRoomAbout(roomID, newAbout) {
    // Получаем ссылку на чат
    const roomRef = await doc(db, 'rooms', roomID);
    // Меняем аватарку
    await updateDoc(roomRef, {
        roomAbout: newAbout,
    })
}

// Функция присвоения прав админа для участника чата 
export async function giveUserAdministratorRights(userID, room) {
    // Формируем новый массив админов
    const newAdminList = [...room.roomAdmin, userID];
    // Формируем новый список админов
    const roomRef = doc(db, 'rooms', room.roomID);
    await updateDoc(roomRef, {
        roomAdmin: newAdminList,
    })
}

// Функция исключения участника чата 
export async function deleteUserFromChat(userID, room) {
    // Удаляем комнату из объекта пользователя
    await removingRoomUser(userID, room.roomID);
    // Удаляем пользователя из объекта комнаты
    const newRoomDoc = await removingUserRoom(userID, room.roomID);
    return newRoomDoc;
}

// Функция поиска личного чата у пользователя
export async function searchPrivateChat(targetUser, currentUser) {
    const userDoc = await userSearchDatabaseID(currentUser);
    const userPrivateChat = userDoc.userPrivateRooms || [];
    return userPrivateChat.includes(targetUser + currentUser);
}