import "./About.css";

const About = () => {
  return (
    <div className="about-container">
      <div className="about-header">
        <h1>אודותינו</h1>
      </div>

      <div className="about-content">
        <div className="about-text">
          <h2>מי אנחנו?</h2>
          <p>
            בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה
            בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה
            בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה
            בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה בלה
          </p>

          {/* <h3>למה לבחור בנו?</h3>
          <ul>
            <li>✅ ניסיון של מעל 10 שנים</li>
            <li>✅ שירות לקוחות אישי וזמין</li>
            <li>✅ פתרונות מותאמים לכל לקוח</li>
            <li>✅ מחירים נוחים ותחרותיים</li>
          </ul> */}
        </div>

        <div className="about-image">
          <img src="/images/א.jpg" alt="הצוות שלנו" />
        </div>
      </div>

      <div className="about-video">
        {/* <h3>הצצה למאחורי הקלעים 🎬</h3> */}
        <video controls width="100%">
          <source src="/video/ועד מבקשי.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
};

export default About;
