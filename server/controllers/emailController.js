const nodemailer = require('nodemailer');

// יצירת transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

// שליחת מייל מצור קשר
exports.sendContactEmail = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Validation
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'כל השדות נדרשים' });
    }

    // בדיקת פורמט מייל
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'פורמט מייל לא תקין' });
    }

    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(500).json({ error: 'הגדרות מייל לא מוגדרות בשרת' });
    }

    const transporter = createTransporter();
    const recipientEmail = process.env.CONTACT_EMAIL || process.env.EMAIL_USER;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: recipientEmail,
      subject: `הודעה חדשה מצור קשר - ${name}`,
      html: `
        <div style="direction: rtl; font-family: Arial, sans-serif;">
          <h2>הודעה חדשה מצור קשר</h2>
          <p><strong>שם:</strong> ${name}</p>
          <p><strong>מייל:</strong> ${email}</p>
          <p><strong>הודעה:</strong></p>
          <p style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">${message.replace(/\n/g, '<br>')}</p>
        </div>
      `,
      replyTo: email,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'ההודעה נשלחה בהצלחה' });
  } catch (err) {
    console.error('Error sending contact email:', err);
    res.status(500).json({ error: 'שגיאה בשליחת ההודעה' });
  }
};

// שליחת מייל למצטרף חדש
exports.sendWelcomeEmail = async (email, name) => {
  try {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.warn('Email settings not configured, skipping welcome email');
      return;
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'ברוכים הבאים לוועד מבקשי השם',
      html: `
        <div style="direction: rtl; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #029ba9;">שלום ${name}!</h2>
          <p>תודה שהצטרפת אלינו!</p>
          <p>אנו שמחים לראותך חלק מהקהילה שלנו.</p>
          <p>נודיע לך על אירועים ופעילויות מעניינות.</p>
          <br>
          <p>בברכה,<br>ועד מבקשי השם</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
  } catch (err) {
    console.error('Error sending welcome email:', err);
    // לא נזרוק שגיאה כדי לא לעצור את תהליך ההרשמה
  }
};




