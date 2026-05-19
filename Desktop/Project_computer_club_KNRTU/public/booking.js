document.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('isLoggedIn') !== 'true') {
    window.location.href = 'auth.html';
    return;
  }

  const form = document.getElementById('bookingForm');
  const bookingList = document.getElementById('bookingList');
  const submitBtn = document.getElementById('submitBtn');

  async function loadBookings() {
    try {
      const res = await fetch('/bookings');
      const bookings = await res.json();

      bookingList.innerHTML = bookings.map(b => `
        <div class="booking-card">
          <p><b>Имя:</b> ${b.name}</p>
          <p><b>Телефон:</b> ${b.phone || '-'}</p>
          <p><b>Дата:</b> ${b.date}</p>
          <p><b>Время:</b> ${b.time}</p>
          <p><b>Услуга:</b> ${b.service || '-'}</p>
          <p><b>Пол:</b> ${b.gender || '-'}</p>
          <p><b>Комментарий:</b> ${b.comment || '-'}</p>

          <div class="booking-actions">
            <button type="button" class="edit-btn" data-id="${b.id}">Редактировать</button>
            <button type="button" class="delete-btn" data-id="${b.id}">Удалить</button>
          </div>
        </div>
      `).join('');
    } catch (error) {
      console.error('Ошибка загрузки броней:', error);
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      name: document.getElementById('name').value.trim(),
      phone: document.getElementById('phone').value.trim(),
      date: document.getElementById('date').value,
      time: document.getElementById('time').value,
      service: document.getElementById('service').value,
      gender: document.querySelector('input[name="gender"]:checked')?.value || '',
      comment: document.getElementById('comment').value.trim()
    };

    const editId = form.dataset.editId;
    const url = editId ? `/bookings/${editId}` : '/bookings';
    const method = editId ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || `Ошибка ${res.status}`);
      }

      form.reset();
      delete form.dataset.editId;
      submitBtn.textContent = 'Отправить заявку';
      loadBookings();
    } catch (error) {
      console.error(error);
      alert('Не удалось сохранить заявку');
    }
  });

  bookingList.addEventListener('click', async (e) => {
    const deleteBtn = e.target.closest('.delete-btn');
    if (deleteBtn) {
      const id = deleteBtn.dataset.id;

      try {
        const res = await fetch(`/bookings/${id}`, { method: 'DELETE' });
        const result = await res.json();

        if (!res.ok) throw new Error(result.error || `Ошибка ${res.status}`);

        loadBookings();
      } catch (error) {
        console.error(error);
        alert('Не удалось удалить заявку');
      }
      return;
    }

    const editBtn = e.target.closest('.edit-btn');
    if (editBtn) {
      const id = editBtn.dataset.id;

      try {
        const res = await fetch(`/bookings/${id}`);
        const booking = await res.json();

        if (!res.ok) throw new Error(booking.error || `Ошибка ${res.status}`);

        document.getElementById('name').value = booking.name || '';
        document.getElementById('phone').value = booking.phone || '';
        document.getElementById('date').value = booking.date || '';
        document.getElementById('time').value = booking.time || '';
        document.getElementById('service').value = booking.service || '';
        document.getElementById('comment').value = booking.comment || '';

        const genderInput = document.querySelector(`input[name="gender"][value="${booking.gender}"]`);
        if (genderInput) genderInput.checked = true;

        form.dataset.editId = id;
        submitBtn.textContent = 'Сохранить изменения';
      } catch (error) {
        console.error(error);
        alert('Не удалось загрузить запись для редактирования');
      }
    }
  });

  loadBookings();
});