/* Задание 1.
Вам дана заготовка и результат, который вы должны получить.
Ваша задача — написать код, который будет преобразовывать XML в JS-объект и выводить его в консоль. */

const parser = new DOMParser();
const xmlString = `
<list>
  <student>
    <name lang="en">
      <first>Ivan</first>
      <second>Ivanov</second>
    </name>
    <age>35</age>
    <prof>teacher</prof>
  </student>
  <student>
    <name lang="ru">
      <first>Петр</first>
      <second>Петров</second>
    </name>
    <age>58</age>
    <prof>driver</prof>
  </student>
</list>
`;
const xmlDOM = parser.parseFromString(xmlString, 'text/xml');

const listNode = xmlDOM.querySelector('list');
const studentNode = listNode.querySelector('student');
const nameNode = studentNode.querySelector('name');
const firstNode = nameNode.querySelector ('first');
const secondNode = nameNode.querySelector ('second');
const ageNode = studentNode.querySelector ('age');
const profNode = studentNode.querySelector ('prof')

const langAttr = nameNode.getAttribute ('lang');

const result = {
  lang: langAttr,
  first : firstNode.textContent,
  second : secondNode.textContent,
  age : Number(ageNode.textContent),
  prof : profNode.textContent,
}
console.log ('result', result)


JS-объект:

{
  list: [
    { name: 'Ivan Ivanov', age: 35, prof: 'teacher', lang: 'en' },
    { name: 'Петр Петров', age: 58, prof: 'driver', lang: 'ru' },
  ]
}


/* Задание 2.
Вам дана заготовка и результат, который вы должны получить.
Ваша задача — написать код, который будет преобразовывать JSON в JS-объект и выводить его в консоль. */

JSON:
const strJson = `
{
 "list": [
  {
   "name": "Petr",
   "age": "20",
   "prof": "mechanic"
  },
  {
   "name": "Vova",
   "age": "60",
   "prof": "pilot"
  }
 ]
}
`;
//получение двнных
const data = JSON.parse(jsonString);
const list = data.list;
//запись данных в результирующий объект
const result = {
  name: list.name,
  age: list.age,
  prof: list.prof,
}
console.log(result)


JS-объект:

{
  list: [
    { name: 'Petr', age: 20, prof: 'mechanic' },
    { name: 'Vova', age: 60, prof: 'pilot' },
  ]
}

/* Задание 3

Напишите код приложения, интерфейс которого представляет собой input и кнопку. В input можно ввести любое число. 
При клике на кнопку происходит следующее:

Если число не попадает в диапазон от 1 до 10 — выводить ниже текст «число вне диапазона от 1 до 10».
Если число попадает в диапазон от 1 до 10 — сделать запрос c помощью XHR по URL https://picsum.photos/v2/list?limit=10, 
где get-параметр limit — это введённое число.
Пример. Если пользователь ввёл 5, то запрос будет вида: https://picsum.photos/v2/list?limit=5.
После получения данных вывести ниже картинки на экран.

Подсказка

Получение данных из input:

const value = document.querySelector('input').value;

Решение */

const submitButton = document.querySelector("button").addEventListener("click", clickButton);
const photosContainer = document.querySelector("div");


function clickButton() {
    const value = document.querySelector('input').value;

    if (value >= 1 && value <= 10 && !isNaN(value)) {
        useRequest("https://picsum.photos/v2/list?limit=" + value, displayResult);
    } else {
        alert("Число вне диапазона от 1 до 10.");
    }
}


function useRequest(url, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);

    xhr.onload = function() {
        if (xhr.status !== 200) {
            write("Статус ответа: ", xhr.status);
        } else {
            const result = JSON.parse(xhr.response);
            if (callback) {
                callback(result);
            }
        }
    };

    xhr.onerror = function() {
        write("Ошибка! Статус ответа: ", xhr.status);
    };

    xhr.send();
};
function displayResult(apiData) {
  let cards = '';
  
  apiData.forEach(item => {
    const cardBlock = `
      <div class="card">
        <img
          src="${item.download_url}"
          style="width: 150px; margin-right: 30px"
        />
        <p>${item.author}</p>
      </div>
    `;
    cards = cards + cardBlock;
  });

    photosContainer.innerHTML = cards;
}

/* Задание 4

Напишите код приложения, интерфейс которого представляет собой 2 input и кнопку submit. В input можно ввести любое число.

При клике на кнопку происходит следующее:

Если оба числа не попадают в диапазон от 100 до 300 или введено не число 
— выводить ниже текст «одно из чисел вне диапазона от 100 до 300»;
Если числа попадают в диапазон от 100 до 300 
— сделать запрос c помощью fetch по URL https://picsum.photos/200/300, где первое число
— ширина картинки, второе — высота.
Пример. Если пользователь ввёл 150 и 200, то запрос будет вида https://picsum.photos/150/200.
После получения данных вывести ниже картинку на экран.

Подсказка

Получение данных из input:

const value = document.querySelector('input').value; */

const submitButton = document.querySelector("button").addEventListener("click", clickButton);
const photosContainer = document.querySelector("div");

function clickButton() {
    const width = document.getElementById("width").value;
    const height = document.getElementById("height").value;

    if ((width < 100 || width > 300 || isNaN(width)) || (height < 100 || height > 300 || isNaN(height))) {
        alert("Одно из чисел вне диапазона от 100 до 300.");
        return;
    } else {
      fetch(`https://picsum.photos/${width}/${height}`)
        .then((response) => response.url)
        .then((result) => {
            loadPhoto(result);
        })
        .catch((reason) => {
            alert("Error " + reason);
        });
    }
}
function loadPhoto(photoUrl) {
    const cardBlock =   `<img
                          src="${photoUrl}"
                          style="margin-right: 30px"
                        />`;

    photosContainer.innerHTML = cardBlock;
}



/* Задание 5.

Написать код приложения, интерфейс которого состоит из двух input и кнопки. В input можно ввести любое число.

Заголовок первого input — «номер страницы».
Заголовок второго input — «лимит».
Заголовок кнопки — «запрос».
При клике на кнопку происходит следующее:

Если число в первом input не попадает в диапазон от 1 до 10 или не является числом — выводить ниже текст «Номер страницы вне диапазона от 1 до 10»;
Если число во втором input не попадает в диапазон от 1 до 10 или не является числом — выводить ниже текст «Лимит вне диапазона от 1 до 10»;
Если и первый, и второй input не в диапазонах или не являются числами — выводить ниже текст «Номер страницы и лимит вне диапазона от 1 до 10»;
Если числа попадают в диапазон от 1 до 10 — сделать запрос по URL https://picsum.photos/v2/list?page=1&limit=10, где GET-параметр page — это число из первого input, а GET-параметр limit — это введённое число второго input.
Пример. Если пользователь ввёл 5 и 7, то запрос будет вида https://picsum.photos/v2/list?page=5&limit=7.
После получения данных вывести список картинок на экран.

Если пользователь перезагрузил страницу, то ему должны показываться картинки из последнего успешно выполненного запроса (использовать localStorage).
*/


const submitButton = document.querySelector("button").addEventListener("click", clickButton);
const photosContainer = document.querySelector("div");

function clickButton() {
    const page = document.getElementById("page").value;
    const limit = document.getElementById("limit").value;

    if ((page < 1 || page > 10 || isNaN(page)) && (limit < 1 || limit > 10 || isNaN(limit))) {
        alert("Номер страницы и лимит вне диапазона от 1 до 10.");
        return;
    } else
    if (page < 1 || page > 10 || isNaN(page)) {
        alert("Номер страницы вне диапазона от 1 до 10.");
        return;
    } else
    if (limit < 1 || limit > 10 || isNaN(limit)) {
        alert("Лимит вне диапазона от 1 до 10.");
        return;
    }

    fetch(`https://picsum.photos/v2/list?page=${page}&limit=${limit}`)
        .then((response) => response.json())
        .then((json) => {
            loadPhotos(json);
            saveLocalStorage();
        })
        .catch((reason) => {
            alert("Error: " + reason);
        });
}

function loadPhotos(apiData) {
    let cards = String();

    apiData.forEach(item => {
        const cardBlock =     `<div>
                                <img
                                  src="${item.download_url}"
                                  style="width: 150px; margin-right: 30px"
                                />
                              </div>`;
        cards += cardBlock;
    });

    photosContainer.innerHTML = cards;
}

