import "./Home.css";
import About from "../about/About";
import React, { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    const counters = document.querySelectorAll(".counter");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const counter = entry.target;
            const target = +counter.getAttribute("data-target");
            let current = 0;
            const increment = Math.max(1, Math.floor(target / 100));

            const updateCount = () => {
              current += increment;
              if (current >= target) {
                counter.textContent = target.toString();
              } else {
                counter.textContent = current.toString();
                setTimeout(updateCount, 25); // 30 מילישניות בין עדכון לעדכון - אפשר לשנות את המספר לפי רצונך
              }
            };

            updateCount();
            observer.unobserve(counter);
          }
        });
      },
      { threshold: 0.5 }
    );

    counters.forEach((counter) => {
      observer.observe(counter);
    });
  }, []);

  return (
    <div>
      <div className="homeBackground">
        <video
          src="/video/ועד מבקשי.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="backgroundVideo"
        />
        <div className="darkOverlay"></div> {/* הריבוע השחור השקוף */}
        <div className="textContainer">
          <div className="logoA">
            <img
              src="images/לוגו ועד מבקשי השם-1.jpg"
              alt="Logo"
              style={{ width: "600px", height: "600px" }}
              className="logo"
            />
          </div>
          {/* <div className="textA">
            <p>ועד</p>
            <p>'מבקשי ה</p>
          </div> */}
        </div>
      </div>
      <div className="aboutContainer">
        <h1>'ועד מבקשי ה</h1>
        <h2>הסיפור שלנו</h2>
        <p>
          ועד מבקשי השם" הינו ארגון בעל יוזמה ייחודית בעולם התורה הישיבתי אשר"
          נותן מענה אמיתי ומתמשך לבחורים במצבים רבים ושונים בדורנו. המענה ניתן
          ומותאם לבחורים רגילים וכך גם לבחורים חלשים ומתקשים, באופן פרטני ובאופן
          כללי. הארגון הוקם ע"י הרב אהרון יצחק בירנצוייג שליט"א ר"מ בישיבת מיר
          בעידודם ותמיכתם הנלהבת של גדולי ישראל שליט"א וזצוקל"ה מתוך מטרה נעלה
          ונצרכת, להיות במקום שאין איש, להציע פתרונות יצירתיים לבעיות שהשגרה
          והשחיקה מייצרות בקרב הבחורים הצעירים, ובמקביל לחזק ולרומם את בני
          הישיבות הקדושות באופן עקבי ע"י ועד שבועי המטעין את הבחורים בחשק מחודש
          להמשך עלייתם הרוחנית עם נתינת דגש על עניין האמונה והחיבור לבורא עולם
          בכל זמן ובכל מצב. כ"כ נדבך חשוב בקיומם של הועדים הוא, ליצור פלטפורמה
          נוחה ומקרבת, המאפשרת לבחורים לפנות ולקבל מענה אישי בנושאים שונים ולשתף
          בלבטים העולים אצלם, כשבדרך כלל הם נמנעים מלשתף את הדמויות המקובלות.
          נקודה חשובה לציון היא העובדה שההשתתפות בועדים והקשר האישי עם הרב
          במקרים רבים היוותה תרופה מקדימה להידרדרות רוחנית. הועד מתקיים מידי
          יום, בשעת ארוחת הערב כל יום בעיר אחרת, בועד מתרכזים בחורים ממגוון
          הישיבות בעיר, במהלכו של הועד מוסר הרב שליט"א דברי חיזוק ועידוד
          המתיישבים על הלב, בשילוב נגינה הפורטת על נימי הנפש ושירי דביקות ורגש.
          הבחורים יושבים סביב שולחנות ערוכים באוכל ביתי ומגוון הנותנים מענה גם
          בפן הגשמי. מידי פעם הועד יוצא לרענון ומתקיים שלא במקום הקבוע, פעמים
          ביערות השקטים הרחוקים משאון העיר ופעמים בקברי צדיקים, בזמנים מתאימים
          כדוגמת תשעת הימים גם בכותל המערבי. בכל ועד נמצא רכז, אברך יר"ש אשר
          מתמסר ומשקיע מזמנו ומרצו לקיומו ותחזוקו של הועד הן בהיבט הגשמי והן
          בהיבט הרוחני תוך קשר מתמיד ורצוף עם הבחורים שבועד. מלבד הועדים הקבועים
          הארגון מקיים פעמיים בשנה אירועים מיוחדים (חנוכה ול"ג בעומר) לאירועים
          אלו מוזמנים הבחורים מכלל הועדים וכן בוגרי וידידי הועד, אירועים אלו
          תורמים לחיבור נוסף של הבחורים עם הועד ורצון להיות שייך. מידי שנה
          הארגון מקיים שבת גיבוש לכלל בני הועדים המתקיימים בשבתות חופשה
          שבישיבות, תוך משימה משותפת של סיומי מסכת הנערכים ב"ועדים" במשך השנה,
          שבתות אלו תורמים תרומה מכרעת בגיבושם של הבחורים וכן בצבירת כוחות
          מחודשת להמשך התנופה הרוחנית. מלבד הועדים לבני הישיבות מקיים הארגון ועד
          שבועי לאברכים בני עליה המקבלים הדרכה מעשית ופרקטית לחיי היום יום, כ"כ
          ועד לנשואים העמלים לפרנסתם המהווה בעבורם קשר לעולם התורה, ולהשקפה
          הברורה תוך חיבור לדמות תורנית כמורינו הרב שליט"א המשייכם לעולם התורני
        </p>
      </div>
      <a href="/About" style={{ textDecoration: "none" }}>
        <button className="buttonAdd">עוד עלינו</button>
      </a>{" "}
      <div className="about">
        <h1>העשייה שלנו במספרים</h1>
        <div className="boxesContainer">
          <div className="box">
            <h4 className="counter" data-target="9">
              0
            </h4>
            <p>מוקדים שונים</p>
          </div>
          <div className="box">
            <h4 className="counter" data-target="220">
              0
            </h4>
            <p>כנסים בשנה</p>
          </div>
          <div className="box">
            <h4 className="counter" data-target="1500">
              0
            </h4>
            <p>בוגרים</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
