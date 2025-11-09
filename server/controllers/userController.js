const supabase = require("../services/supabaseService");
const { sendWelcomeEmail } = require("./emailController");

// שליפת כל המשתמשים
exports.getAllUsers = async (req, res) => {
  try {
    const { data, error } = await supabase.from("users").select("*");
    if (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({ error: error.message });
    }
    res.json(data);
  } catch (err) {
    console.error("Unexpected error in getAllUsers:", err);
    res.status(500).json({ error: "שגיאה בשרת" });
  }
};

// הוספת משתמש
exports.addUser = async (req, res) => {
  try {
    const { fname, Email } = req.body;

    // Validation
    if (!fname || !Email) {
      return res.status(400).json({ error: "שם פרטי ומייל נדרשים" });
    }

    // בדיקת פורמט מייל בסיסי
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(Email)) {
      return res.status(400).json({ error: "פורמט מייל לא תקין" });
    }

    const { data, error } = await supabase
      .from("users")
      .insert([{ fname, Email }])
      .select();
    
    if (error) {
      console.error("Error adding user:", error);
      return res.status(500).json({ error: error.message });
    }
    
    // שליחת מייל ברכה (לא חוסם אם נכשל)
    try {
      await sendWelcomeEmail(Email, fname);
    } catch (emailError) {
      console.warn("Failed to send welcome email:", emailError);
      // ממשיכים גם אם שליחת המייל נכשלה
    }
    
    res.status(201).json(data[0]);
  } catch (err) {
    console.error("Unexpected error in addUser:", err);
    res.status(500).json({ error: "שגיאה בשרת" });
  }
};

// מחיקת משתמש לפי id
exports.deleteUser = async (req, res) => {
  try {
    const id = req.params.id;
    
    if (!id) {
      return res.status(400).json({ error: "ID נדרש" });
    }

    const { error } = await supabase.from("users").delete().eq("id", id);
    if (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ error: error.message });
    }
    res.status(204).send();
  } catch (err) {
    console.error("Unexpected error in deleteUser:", err);
    res.status(500).json({ error: "שגיאה בשרת" });
  }
};

// עדכון משתמש
exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { fname, lname, Email } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID נדרש" });
    }

    // Validation
    if (Email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(Email)) {
        return res.status(400).json({ error: "פורמט מייל לא תקין" });
      }
    }

    const updateData = {};
    if (fname !== undefined) updateData.fname = fname;
    if (lname !== undefined) updateData.lname = lname;
    if (Email !== undefined) updateData.Email = Email;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: "אין נתונים לעדכון" });
    }

    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", id)
      .select();
    
    if (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ error: error.message });
    }
    
    if (!data || data.length === 0) {
      return res.status(404).json({ error: "משתמש לא נמצא" });
    }
    
    res.json(data[0]);
  } catch (err) {
    console.error("Unexpected error in updateUser:", err);
    res.status(500).json({ error: "שגיאה בשרת" });
  }
};
