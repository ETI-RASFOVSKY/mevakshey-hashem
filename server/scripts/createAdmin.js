/**
 * סקריפט ליצירת/עדכון מנהל ב-Supabase
 * 
 * שימוש:
 * node server/scripts/createAdmin.js
 * 
 * או עם סיסמה מותאמת אישית:
 * ADMIN_PASSWORD=your_password node server/scripts/createAdmin.js
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const bcrypt = require('bcrypt');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ חסר SUPABASE_URL או SUPABASE_KEY ב-.env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
  try {
    console.log('🔐 יוצר hash לסיסמה...');
    
    // קבלת סיסמה
    const password = process.env.ADMIN_PASSWORD || '1234!1234';
    
    if (!process.env.ADMIN_PASSWORD) {
      console.log('⚠️  לא צוינה סיסמה ב-ADMIN_PASSWORD, משתמש בסיסמה ברירת מחדל: 1234!1234');
      console.log('💡 כדי להשתמש בסיסמה אחרת: ADMIN_PASSWORD=your_password node server/scripts/createAdmin.js\n');
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    console.log('🔍 בודק אם יש כבר admin ב-Supabase...');
    
    // בדיקה אם יש כבר admin
    const { data: existingAdmins, error: fetchError } = await supabase
      .from('admins')
      .select('*')
      .eq('role', 'admin')
      .limit(1);

    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 = לא נמצאו תוצאות
      console.error('❌ שגיאה בבדיקת admins:', fetchError);
      throw fetchError;
    }

    if (existingAdmins && existingAdmins.length > 0) {
      console.log('⚠️  נמצא מנהל קיים במסד הנתונים');
      console.log('🔄 מעדכן את הסיסמה...');
      
      const { error: updateError } = await supabase
        .from('admins')
        .update({ passwordhash: passwordHash })
        .eq('role', 'admin');

      if (updateError) {
        console.error('❌ שגיאה בעדכון admin:', updateError);
        throw updateError;
      }
      
      console.log('✅ הסיסמה עודכנה בהצלחה!');
    } else {
      console.log('➕ יוצר מנהל חדש...');
      
      const { data, error: insertError } = await supabase
        .from('admins')
        .insert([
          {
            passwordhash: passwordHash,
            role: 'admin'
          }
        ])
        .select();

      if (insertError) {
        console.error('❌ שגיאה ביצירת admin:', insertError);
        throw insertError;
      }
      
      console.log('✅ מנהל נוצר בהצלחה!');
      console.log(`🆔 ID: ${data[0].id}`);
    }

    console.log('\n✅ ההגדרה הושלמה!');
    console.log('💡 ניתן כעת להתחבר עם הסיסמה:', password);
    console.log('\n📝 הוסף ל-.env (אופציונלי, fallback):');
    console.log(`ADMIN_HASH=${passwordHash}\n`);
    
  } catch (err) {
    console.error('❌ שגיאה:', err.message || err);
    if (err.code === '42P01') {
      console.error('\n⚠️  נראה שטבלת admins לא קיימת ב-Supabase!');
      console.error('📋 צור את הטבלה ב-Supabase:');
      console.error(`
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  passwordhash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
      `);
    }
    process.exit(1);
  }
}

// הרצה
if (require.main === module) {
  createAdmin().catch(console.error);
}

module.exports = { createAdmin };
