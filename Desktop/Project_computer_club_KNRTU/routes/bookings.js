const express = require('express');
const router = express.Router();
const db = require('../db');

router.get('/', (req, res) => {
  db.all('SELECT * FROM bookings ORDER BY id DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  db.get('SELECT * FROM bookings WHERE id = ?', [id], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!row) return res.status(404).json({ error: 'Booking not found' });
    res.json(row);
  });
});

router.post('/', (req, res) => {
  const { name, phone, date, time, service, gender, comment } = req.body;

  if (!name || !phone || !date || !time || !service || !gender) {
    return res.status(400).json({ error: 'Заполните все обязательные поля' });
  }

  if (gender === 'male') {
    return res.status(400).json({ error: 'Мужской пол нельзя выбрать' });
  }

  db.run(
    `INSERT INTO bookings (name, phone, date, time, service, gender, comment)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, phone, date, time, service, gender, comment || ''],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      res.status(201).json({
        id: this.lastID,
        name,
        phone,
        date,
        time,
        service,
        gender,
        comment: comment || ''
      });
    }
  );
});

router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, phone, date, time, service, gender, comment } = req.body;

  if (!name || !phone || !date || !time || !service || !gender) {
    return res.status(400).json({ error: 'Заполните все обязательные поля' });
  }

  if (gender === 'male') {
    return res.status(400).json({ error: 'Мужской пол нельзя выбрать' });
  }

  db.run(
    `UPDATE bookings
     SET name = ?, phone = ?, date = ?, time = ?, service = ?, gender = ?, comment = ?
     WHERE id = ?`,
    [name, phone, date, time, service, gender, comment || '', id],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      if (this.changes === 0) return res.status(404).json({ error: 'Booking not found' });

      res.json({
        id: Number(id),
        name,
        phone,
        date,
        time,
        service,
        gender,
        comment: comment || ''
      });
    }
  );
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;

  db.run('DELETE FROM bookings WHERE id = ?', [id], function (err) {
    if (err) return res.status(500).json({ error: err.message });
    if (this.changes === 0) return res.status(404).json({ error: 'Booking not found' });

    res.json({ message: 'Booking deleted', id: Number(id) });
  });
});

module.exports = router;