const welcomeModal = document.getElementById('welcomeModal');
const closeWelcomeButton = document.getElementById('closeWelcome');
const welcomeTitle = document.getElementById('welcomeTitle'); 
const welcomeText = document.getElementById('welcomeText');
const imageContainer = document.querySelector('.image-container');
const balanceDisplay = document.getElementById('coin-balance');

// Элементы для перевода
const mainTitle = document.getElementById('main-title');
const homeLink = document.getElementById('home-link');
const tasksLink = document.getElementById('tasks-link');
const friendsLink = document.getElementById('friends-link');

// Флаги
const russianFlag = document.querySelector('.language-flag[data-lang="ru"]');
const englishFlag = document.querySelector('.language-flag[data-lang="en"]');

// Настройки (модальное окно)
const settingsButton = document.getElementById('settingsButton'); // Добавьте кнопку настроек
const settingsModal = document.getElementById('settingsModal');
const languageSelect = document.getElementById('languageSelect');
const saveSettingsButton = document.getElementById('saveSettings');

let balance = parseInt(localStorage.getItem('coinBalance') || '0', 10);
balanceDisplay.textContent = balance;

function getRandomCoins() {
  return Math.floor(Math.random() * 5) + 1;
}

function updateBalance(earnedCoins) {
  balance += earnedCoins;
  balanceDisplay.textContent = balance;
  localStorage.setItem('coinBalance', balance);
}

function createCoinAnimation(x, y, earnedCoins) {
  const coinAnimation = document.createElement('div');
  coinAnimation.classList.add('coin-animation');
  coinAnimation.textContent = `+${earnedCoins}`;
  coinAnimation.style.left = `${x}px`;
  coinAnimation.style.top = `${y}px`;
  imageContainer.appendChild(coinAnimation);
  setTimeout(() => {
    coinAnimation.remove();
  }, 500);
}

imageContainer.addEventListener('click', (event) => {
  const earnedCoins = getRandomCoins();
  updateBalance(earnedCoins);

  const clickX = event.clientX - imageContainer.getBoundingClientRect().left;
  const clickY = event.clientY - imageContainer.getBoundingClientRect().top;
  createCoinAnimation(clickX, clickY, earnedCoins);
});

// Переводы
const translations = {
  ru: {
    appName: 'Тапай и зарабатывай!',
    settings: 'Настройки',
    language: 'Язык',
    save: 'Сохранить',
    home: 'Home',
    tasks: 'Tasks',
    friends: 'Friends'
  },
  en: {
    appName: 'Click and Earn!',
    settings: 'Settings',
    language: 'Language',
    save: 'Save',
    home: 'Главная',
    tasks: 'Задачи',
    friends: 'Друзья'
  }
};


// Функция обновления языка
function updateLanguage(lang) {
  mainTitle.textContent = translations[lang].appName; 
  settingsModal.querySelector('h2').textContent = translations[lang].settings;
  settingsModal.querySelector('label').textContent = translations[lang].language;
  saveSettingsButton.textContent = translations[lang].save;
  homeLink.textContent = translations[lang].home;
  tasksLink.textContent = translations[lang].tasks;
  friendsLink.textContent = translations[lang].friends;
}

// Установка языка по умолчанию 
let currentLang = localStorage.getItem('language') || 'ru';
updateLanguage(currentLang);
languageSelect.value = currentLang;

// Обработчики для флагов
russianFlag.addEventListener('click', () => {
  changeLanguage('ru');
});

englishFlag.addEventListener('click', () => {
  changeLanguage('en');
});

// Функция для смены языка
function changeLanguage(newLang) {
  // 1. Обновляем активный класс для флагов
  russianFlag.classList.toggle('active', newLang === 'ru');
  englishFlag.classList.toggle('active', newLang === 'en');

  // 2. Обновляем язык в localStorage и на странице
  localStorage.setItem('language', newLang);
  updateLanguage(newLang);

  // 3. Обновляем значение в select (опционально)
  languageSelect.value = newLang;
}

// Обработчики событий
settingsButton.addEventListener('click', () => {
  settingsModal.style.display = 'block';
});

saveSettingsButton.addEventListener('click', () => {
  const selectedLang = languageSelect.value;
  localStorage.setItem('language', selectedLang);
  updateLanguage(selectedLang);
  settingsModal.style.display = 'none';
});
const welcomeTranslations = {
    ru: {
      title: 'Добро пожаловать в FoxSwap!',
      text: 'Здесь ты сможешь кликать, выполнять задания и получать монеты. Приглашай друзей и получай бонусы!'
    },
    en: {
      title: 'Welcome to FoxSwap!',
      text: 'Here you can click, complete tasks and earn coins. Invite friends and get bonuses!'
    }
  };
  
  // Функция для обновления языка приветственного окна
  function updateWelcomeLanguage(lang) {
    welcomeTitle.textContent = welcomeTranslations[lang].title;
    welcomeText.textContent = welcomeTranslations[lang].text;
  }
  
  // Обновляем язык при загрузке страницы
  updateWelcomeLanguage(currentLang); 
  
 
  