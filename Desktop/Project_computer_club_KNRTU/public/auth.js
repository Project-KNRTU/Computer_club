document.addEventListener('DOMContentLoaded', () => {
  const authForm = document.getElementById('authForm');
  const loginBtn = document.getElementById('loginBtn');
  const authMessage = document.getElementById('authMessage');

  function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
  }

  function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
  }

  authForm.addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    const users = getUsers();
    const exists = users.find(user => user.email === email);

    if (exists) {
      authMessage.textContent = 'Пользователь с таким email уже существует.';
      return;
    }

    users.push({ username, email, password });
    saveUsers(users);

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify({ username, email }));

    window.location.href = 'reservation.html';
  });

  loginBtn.addEventListener('click', function () {
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();

    const users = getUsers();
    const user = users.find(item => item.email === email && item.password === password);

    if (!user) {
      authMessage.textContent = 'Неверный email или пароль.';
      return;
    }

    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('currentUser', JSON.stringify({
      username: user.username,
      email: user.email
    }));

    window.location.href = 'reservation.html';
  });
});