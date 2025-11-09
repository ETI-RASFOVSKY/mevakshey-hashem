import { useEffect, useState } from "react";
import "./App.css";
import Donor from "./features/donors/Donor";
import About from "./features/about/About";
import ImageGallery from "./features/images/ImageGallery";
import "./features/home/Home.css";
import FooterForm from "./features/footer/FooterForm";
import { Routes, Route, Link, NavLink, Navigate } from "react-router-dom";
import Home from "./features/home/Home";
import ContactUs from "./features/Contact us/ContactUs";
import AdminLogin from "./features/AdminLogin/AdminLogin";
import { isAuthenticated, removeAuthToken } from "./config";

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // בדיקה אם יש token תקף
    setIsAdmin(isAuthenticated());
  }, []);

  const handleLogin = (success) => {
    if (success) {
      setIsAdmin(true);
    }
  };

  const handleLogout = () => {
    removeAuthToken();
    setIsAdmin(false);
  };

  return (
    <div className="appContainer">
      <div className="topContent">
        <header>
          <nav>
            <img
              src="images/לוגו ועד מבקשי השם-1.jpg"
              alt="Logo"
              style={{ width: "150px", height: "150px" }}
              className="logo"
            />
            <div className="allNav">
              <NavLink to="/">דף בית</NavLink>

              {/* רק אם מנהל מחובר, הקישור ל-Donor */}
              {isAdmin && <Link to="/Donor">משתמשים</Link>}

              <NavLink to="/About">אודותינו</NavLink>
              <NavLink to="/ImageGallery">גלריה</NavLink>
              <NavLink to="/ContactUs">צור קשר</NavLink>

              {/* רק למשתמשים שאינם מנהלים */}
              {!isAdmin && <NavLink to="/AdminLogin">כניסת מנהל</NavLink>}

              {/* כפתור התנתקות למנהלים */}
              {isAdmin && (
                <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontSize: 'inherit' }}>
                  התנתק
                </button>
              )}

              <a
                href="https://www.matara.pro/nedarimplus/online/?mosad=7004497"
                target="_blank"
                rel="noopener noreferrer"
                className="donateButton"
              >
                תרומות
              </a>
            </div>
          </nav>
        </header>
      </div>

      <Routes>
        <Route
          path="/AdminLogin"
          element={<AdminLogin onLogin={handleLogin} />}
        />
        <Route path="/" element={<Home isAdmin={isAdmin} />} />
        <Route
          path="/Donor"
          element={isAdmin ? <Donor /> : <Navigate to="/" replace />}
        />
        <Route path="/About" element={<About />} />
        <Route path="/ImageGallery" element={<ImageGallery />} />
        <Route path="/ContactUs" element={<ContactUs />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <div className="footerId">
        <FooterForm />
      </div>
      <div className="bodyA"></div>
      <footer className="footer">
        <div className="footerContent">
          <p>✉ מייל: V026233313@gmail.com</p>
          <p>☎ טלפון: 026233313</p>
          <p>כתובת: ברוך רפפורט 25, ירושלים</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
