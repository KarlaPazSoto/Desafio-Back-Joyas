const express = require('express');
const cors = require('cors');
const { pool } = require('./config');
const port = 3456;

const app = express();

app.get('/joyas', async (req, res) => {
  const { limits = 10, page = 1, order_by = 'id_ASC' } = req.query;
  const [orderColumn, orderDirection] = order_by.split('_');

  try {
    const result = await pool.query(`
      SELECT * FROM inventario 
      ORDER BY ${orderColumn} ${orderDirection} 
      LIMIT $1 
      OFFSET $2
    `, [limits, (page - 1) * limits]);

    const totalItems = (await pool.query('SELECT COUNT(*) FROM inventario')).rows[0].count;
    const totalPages = Math.ceil(totalItems / limits);

    res.json({
      totalItems: parseInt(totalItems),
      totalPages,
      currentPage: parseInt(page),
      items: result.rows,
      _links: {
        self: `/joyas?limits=${limits}&page=${page}&order_by=${order_by}`,
        next: page < totalPages ? `/joyas?limits=${limits}&page=${parseInt(page) + 1}&order_by=${order_by}` : null,
        prev: page > 1 ? `/joyas?limits=${limits}&page=${parseInt(page) - 1}&order_by=${order_by}` : null
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}
  visit: http://localhost:${port}`);
});