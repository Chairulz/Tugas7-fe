document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const res = await fetch('http://localhost:3000/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: username.value,
      password: password.value
    })
  });
  const data = await res.json();
  if (data.accessToken) {
    localStorage.setItem('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    window.location.href = 'notes.html';
  } else {
    alert('Login gagal');
  }
});

document.getElementById('registerForm')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const res = await fetch('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      username: username.value,
      password: password.value
    })
  });
  if (res.ok) {
    alert('Registrasi berhasil. Silakan login.');
    window.location.href = 'login.html';
  } else {
    alert('Registrasi gagal');
  }
});