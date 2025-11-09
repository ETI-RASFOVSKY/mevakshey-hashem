import { useState } from 'react';
import './ContactUs.css';
import { API_BASE_URL } from '../../config';
import { Alert, CircularProgress, Box } from '@mui/material';

const ContactUs = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/email/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'שגיאה בשליחת ההודעה');
      }

      setSent(true);
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Error sending contact form:', err);
      setError(err.message || 'שגיאה בשליחת ההודעה. נסה שוב מאוחר יותר.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-page">
      <div className="contact-box">
        <h2>צור קשר</h2>
        {sent ? (
          <Box>
            <Alert severity="success" sx={{ mb: 2 }}>
              ההודעה נשלחה בהצלחה! נחזור אליך בהקדם.
            </Alert>
            <button 
              onClick={() => setSent(false)} 
              className="contact-button"
              style={{ marginTop: '10px' }}
            >
              שלח הודעה נוספת
            </button>
          </Box>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            <input
              type="text"
              name="name"
              placeholder="שם מלא"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <input
              type="email"
              name="email"
              placeholder="אימייל"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <textarea
              name="message"
              placeholder="הודעה"
              rows="4"
              value={formData.message}
              onChange={handleChange}
              required
              disabled={loading}
            />
            <button type="submit" disabled={loading} className="contact-button">
              {loading ? (
                <Box display="flex" alignItems="center" justifyContent="center" gap={1}>
                  <CircularProgress size={20} />
                  שולח...
                </Box>
              ) : (
                'שלח'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ContactUs;
