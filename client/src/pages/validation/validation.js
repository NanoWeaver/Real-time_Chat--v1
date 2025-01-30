export function validationUserName(input) {
    if (input.value !== '' && input.value.length >= 3 && input.value.length <= 50) {
        let valid = true;
        for (let i = 0; i < input.value.length; i++) { 
            if (!(/\p{L}/u.test(input.value[i]))) { // Используем регулярное выражение для проверки символа
                valid = false;
            };
        };
        if (valid) {
            return true
        } else {
            return false
        }
    } else {
        false
    }
}

export function validationUserLigin(input) {
    if (input.value !== '' && input.value.length >= 5 && input.value.length <= 50) {
        return true
    } else {
        false
    }
}

export function validationUserPassword(input) {
    if (input.value !== '' && input.value.length >= 6 && input.value.length <= 50) {
        return true
    } else {
        false
    }
}