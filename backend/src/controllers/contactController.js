const db = require('../config/db');

// Submit a new contact message
exports.submitMessage = async (req, res) => {
  const { name, email, message } = req.body;
  
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields (name, email, message) are required.' });
  }

  try {
    const result = await db.query(
      'INSERT INTO contact_messages (name, email, message) VALUES ($1, $2, $3) RETURNING *',
      [name, email, message]
    );
    res.status(201).json({
      message: 'Your message has been sent successfully.',
      data: result.rows[0],
    });
  } catch (error) {
    console.error('submitMessage Error:', error);
    res.status(500).json({ error: 'An error occurred while sending your message. Please try again.' });
  }
};

// Get all messages for admin
exports.getMessages = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error('getMessages Error:', error);
    res.status(500).json({ error: 'An error occurred while fetching contact messages.' });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  const { id } = req.params;
  
  try {
    const result = await db.query('DELETE FROM contact_messages WHERE message_id = $1 RETURNING *', [id]);
    
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Message not found.' });
    }
    
    res.status(200).json({ message: 'Message deleted successfully.', id });
  } catch (error) {
    console.error('deleteMessage Error:', error);
    res.status(500).json({ error: 'An error occurred while deleting the message.' });
  }
};
