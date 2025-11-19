const supabase = require("../services/supabaseService");
const { sendWelcomeEmail } = require("./emailController");

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

async function createUserRecord({ fname, Email }) {
  if (!fname || !Email) {
    const error = new Error("שם פרטי ומייל נדרשים");
    error.status = 400;
    throw error;
  }

  if (!emailRegex.test(Email)) {
    const error = new Error("פורמט מייל לא תקין");
    error.status = 400;
    throw error;
  }

  const { data, error } = await supabase
    .from("users")
    .insert([{ fname, Email }])
    .select();

  if (error) {
    console.error("Error adding user:", error);

    // טיפול בשגיאה של כפילות (unique violation)
    if (error.code === "23505") {
      const dupError = new Error("מייל זה כבר רשום במערכת");
      dupError.status = 409;
      throw dupError;
    }

    throw error;
  }

  const newUser = data[0];

  // שליחת מייל ברכה (לא חוסם אם נכשל)
  try {
    await sendWelcomeEmail(Email, fname);
  } catch (emailError) {
    console.warn("Failed to send welcome email:", emailError);
  }

  return newUser;
}

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

// הוספת משתמש (למנהל)
exports.addUser = async (req, res) => {
  try {
    const user = await createUserRecord(req.body);
    res.status(201).json(user);
  } catch (err) {
    console.error("Unexpected error in addUser:", err);
    res.status(err.status || 500).json({ error: err.message || "שגיאה בשרת" });
  }
};

// רישום משתמש על ידי הציבור (ללא צורך במנהל)
exports.publicSubscribe = async (req, res) => {
  try {
    const user = await createUserRecord(req.body);
    res.status(201).json({ message: "נרשמת בהצלחה", user });
  } catch (err) {
    console.error("Unexpected error in publicSubscribe:", err);
    res.status(err.status || 500).json({ error: err.message || "שגיאה בשרת" });
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
