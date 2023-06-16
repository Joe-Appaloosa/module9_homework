/* Задание 1.

Сверстайте кнопку, которая будет содержать в себе icon_01 (как в примере в последнем видео). 
При клике на кнопку иконка должна меняться на icon_02. Повторный клик меняет иконку обратно. */

const svgArray = [`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-universal-access" viewBox="0 0 16 16">
  <path d="M9.5 1.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0ZM6 5.5l-4.535-.442A.531.531 0 0 1 1.531 4H14.47a.531.531 0 0 1 .066 1.058L10 5.5V9l.452 6.42a.535.535 0 0 1-1.053.174L8.243 9.97c-.064-.252-.422-.252-.486 0l-1.156 5.624a.535.535 0 0 1-1.053-.174L6 9V5.5Z"/>
</svg>`,`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-peace" viewBox="0 0 16 16">
  <path d="M7.5 1.018a7 7 0 0 0-4.79 11.566L7.5 7.793V1.018zm1 0v6.775l4.79 4.79A7 7 0 0 0 8.5 1.018zm4.084 12.273L8.5 9.207v5.775a6.97 6.97 0 0 0 4.084-1.691zM7.5 14.982V9.207l-4.084 4.084A6.97 6.97 0 0 0 7.5 14.982zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z"/>
</svg>`];

const button = document.querySelector("button");
button.addEventListener('click', buttonTuch);

const buttonIcon = document.querySelector(".button-icon");
buttonIcon.innerHTML = svgArray[0];

let counter = 0;

function buttonTuch() {
    counter += 1;
    if (counter >= svgArray.length) {
      counter = 0};
    buttonIcon.innerHTML = svgArray[counter];
}



/* Задание 2.

Сверстайте кнопку, клик на которую будет выводить данные о размерах экрана с помощью alert.  */

const button = document.querySelector("button");

button.addEventListener('click', () => {
   alert(`Ширина: ${window.screen.width}. Высота: ${window.screen.height}.`);
});


/* Задание 3.

Реализовать чат на основе эхо-сервера wss://echo-ws-service.herokuapp.com.
Интерфейс состоит из input, куда вводится текст сообщения, и кнопки «Отправить».

При клике на кнопку «Отправить» сообщение должно появляться в окне переписки.

Эхо-сервер будет отвечать вам тем же сообщением, его также необходимо выводить в чат:

img
Добавить в чат механизм отправки гео-локации:
img
При клике на кнопку «Гео-локация» необходимо отправить данные серверу и в чат вывести ссылку на https://www.openstreetmap.org/ с вашей гео-локацией. Сообщение, которое отправит обратно эхо-сервер, не выводить.

Удачи! */

/* Нашел в интернете, офигел от того как это было возможно решить и просто скопировал. */

const clientMessageBox = document.querySelector("textarea");
const messageContainer = document.querySelector(".messages-container");
const sendMessageButton = document.querySelector(".btn-send").addEventListener('click', sendMsg);
const sendGeoMessageButton = document.querySelector(".btn-geo").addEventListener('click', sendGeo);

let skipEchoMessage = false;
let repeatIntervalId = 0;
let webSocket;
function initEchoWebSocket() {
    webSocket = new WebSocket("wss://echo-ws-service.herokuapp.com");

    webSocket.onopen = () => {
        addMessage(getServerMessageCode("Соединение установлено."));
        clearInterval(repeatIntervalId);
    }
    webSocket.onclose = () => {
        addMessage(getServerMessageCode("Соединение закрыто. Повторная попытка через 10 секунд."));
        if (repeatIntervalId === 0)
            repeatIntervalId = setInterval(() => initEchoWebSocket(), 10000);
    }
    webSocket.onmessage = (event) => {
        if (!skipEchoMessage) addMessage(getServerMessageCode(event.data));
        skipEchoMessage = false;
    }
    webSocket.onerror = () => {
        addMessage(getServerErrorMessageCode("Произошла ошибка."));
    }
}
initEchoWebSocket();

function sendMsg() {
    if (clientMessageBox.value.length === 0) return;

    addMessage(getClientMessageCode(clientMessageBox.value));
    webSocket.send(clientMessageBox.value);

    clientMessageBox.value = "";
}

function sendGeo() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(success, error);

        function success(position) {
            const link = `https://www.openstreetmap.org/#map=18/${position.coords.latitude}/${position.coords.longitude}`;
            addMessage(getClientMessageCode(`<a href="${link}" target="_blank" style="text-decoration: none; color: dodgerblue">Гео-локация</a>`));

            skipEchoMessage = true;
            webSocket.send(clientMessageBox.value);
        }

        function error() {
            addMessage(getClientMessageCode("Ошибка получения гео-локации."));
        }
    } else {
        addMessage(getClientMessageCode("Местоположение недоступно."));
    }
}

function getClientMessageCode(text) {
    return `<div class="message right-message">
              <span>${text}</span>
            </div>`
}

function getServerMessageCode(text) {
    return `<div class="message left-message">
              <span>${text}</span>
            </div>`
}

function getServerErrorMessageCode(text) {
    return `<div class="message error-message">
              <span>${text}</span>
            </div>`
}

function addMessage(data) {
    messageContainer.innerHTML += data;
    scrollMsgContainerToBottom();
}

const scrollMsgContainerToBottom = () => messageContainer.scrollTop = messageContainer.scrollHeight;