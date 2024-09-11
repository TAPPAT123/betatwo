// script.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app-compat.js";
import { getFirestore, doc, getDoc, setDoc, getDocs, query, where, collection } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore-compat.js";

// TODO: Замени на твою конфигурацию Firebase

  const firebaseConfig = {
    apiKey: "AIzaSyBQh47_6mN23DZ37YzQAplAmvZ9I3tnIdM",
    authDomain: "foxswap1-c32af.firebaseapp.com",
    projectId: "foxswap1-c32af",
    storageBucket: "foxswap1-c32af.appspot.com",
    messagingSenderId: "402106129665",
    appId: "1:402106129665:web:ca436fd0cde65e65078f00"
   };


const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// --- ФУНКЦИИ ДЛЯ РАБОТЫ С ПОЛЬЗОВАТЕЛЯМИ --- 

// Генерация случайного userId
function generateUserId() {
  return 'user-' + Math.random().toString(36).substring(2, 15);
}

// Получение userId (создает новый, если его нет)
function getUserId() {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = generateUserId();
    localStorage.setItem('userId', userId);
  }
  return userId;
}

// Генерация реферальной ссылки
function generateReferralLink(userId) {
  return `https://tappat123.github.io/betatwo/{btoa(userId)}`; 
}

// Обновление баланса монет пользователя 
async function updateCoinBalance(userId, coinsToAdd) {
  try {
    const userDocRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      const currentCoins = userDoc.data().coins || 0;
      await setDoc(userDocRef, { coins: currentCoins + coinsToAdd }, { merge: true });
      console.log('Баланс монет обновлен!');
    } else {
      // Если пользователь не найден, создаем его с начальным балансом
      await setDoc(userDocRef, { coins: coinsToAdd, referrals: 0 }); 
      console.log('Пользователь создан с начальным балансом!');
    }
  } catch (error) {
    console.error('Ошибка при обновлении баланса:', error);
  }
}

// --- ОБРАБОТКА РЕФЕРАЛОВ ---

// Функция для обработки реферальной ссылки
async function handleReferral(referrerId, userId) {
  try {
    // Проверка на самореферал 
    if (referrerId === userId) {
      console.log('Пользователь не может быть рефералом сам себе');
      return; 
    }

    const referrerDocRef = doc(db, 'users', referrerId);
    const referrerDoc = await getDoc(referrerDocRef);

    if (referrerDoc.exists()) {
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists() || !userDoc.data().referredBy) {
        // Пользователь новый или не имеет реферера
        const currentReferrals = referrerDoc.data().referrals || 0;

        await Promise.all([
          setDoc(referrerDocRef, { referrals: currentReferrals + 1 }, { merge: true }),
          setDoc(userDocRef, { referredBy: referrerId, coins: 25000 }, { merge: true }) // Устанавливаем реферера и начальные монеты новому пользователю 
        ]);

        console.log('Реферал успешно засчитан!');
        // Добавляем 25000 монет рефереру
        await updateCoinBalance(referrerId, 25000); 
      } else {
        console.log('Пользователь уже был приглашен ранее.');
      }
    } else {
      console.log('Пользователь-реферер не найден.');
    }
  } catch (error) {
    console.error('Ошибка при обработке реферала:', error);
  }
}

// --- ЗАПУСК --- 

// Получаем userId 
const userId = getUserId();

// Генерируем и отображаем ссылку
const referralLink = generateReferralLink(userId);
document.getElementById('referral-link').textContent = referralLink;

// Обработка реферала (если есть ref в URL)
const urlParams = new URLSearchParams(window.location.search);
const referrerId = urlParams.get('ref');

if (referrerId) {
  handleReferral(atob(referrerId), userId); 
}
