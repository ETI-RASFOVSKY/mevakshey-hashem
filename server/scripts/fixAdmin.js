/**
 * סקריפט לתיקון Admin - מעדכן את ה-hash עם hash קיים או יוצר חדש
 * 
 * שימוש:
 * node server/scripts/fixAdmin.js
 * 
 * עם hash קיים:
 * ADMIN_HASH=$2b$10$... node server/scripts/fixAdmin.js
 * 
 * עם סיסמה חדשה:
 * ADMIN_PASSWORD=your_password node server/scripts/fixAdmin.js
 */
console.log(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const bcrypt = require('bcrypt');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ חסר SUPABASE_URL או SUPABASE_KEY ב-.env');
  console.error('📝 ודא שיש לך ב-server/.env:');
  console.error('   SUPABASE_URL=your_supabase_url');
  console.error('   SUPABASE_KEY=your_supabase_key');
  console.error('   או SUPABASE_SERVICE_ROLE_KEY=your_service_role_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function fixAdmin() {
  try {
    console.log('🔧 תיקון Admin...\n');

    // אם יש hash קיים ב-ENV או מהפרמטרים
    let passwordHash = process.env.ADMIN_HASH;
    let password = null;

    if (passwordHash) {
      console.log('📝 נמצא ADMIN_HASH, משתמש בו...');
      console.log(`   Hash: ${passwordHash.substring(0, 30)}...\n`);
    } else if (process.env.ADMIN_PASSWORD) {
      password = process.env.ADMIN_PASSWORD;
      console.log(`🔐 יוצר hash לסיסמה: ${password}`);
      passwordHash = await bcrypt.hash(password, 10);
      console.log(`   Hash: ${passwordHash.substring(0, 30)}...\n`);
    } else {
      // ברירת מחדל - סיסמה ידועה
      password = '1234!1234';
      console.log(`🔐 משתמש בסיסמה ברירת מחדל: ${password}`);
      console.log('💡 כדי להשתמש בסיסמה אחרת: ADMIN_PASSWORD=your_password node server/scripts/fixAdmin.js\n');
      passwordHash = await bcrypt.hash(password, 10);
      console.log(`   Hash: ${passwordHash.substring(0, 30)}...\n`);
    }

    console.log('🔍 בודק אם יש כבר admin ב-Supabase...');
    
    const { data: existingAdmins, error: fetchError } = await supabase
      .from('admins')
      .select('*')
      .eq('role', 'admin')
      .limit(1);

    if (fetchError) {
      if (fetchError.code === '42P01' || fetchError.message?.includes('does not exist')) {
        console.error('❌ טבלת admins לא קיימת ב-Supabase!');
        console.error('\n📋 צור את הטבלה ב-Supabase SQL Editor:');
        console.error(`
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  passwordhash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
        `);
        process.exit(1);
      } else {
        console.error('❌ שגיאה בבדיקת admins:', fetchError);
        throw fetchError;
      }
    }

    if (existingAdmins && existingAdmins.length > 0) {
      console.log('⚠️  נמצא מנהל קיים במסד הנתונים');
      console.log(`   Hash קיים: ${existingAdmins[0].passwordhash.substring(0, 30)}...`);
      console.log('🔄 מעדכן את הסיסמה...\n');
      
      const { data, error: updateError } = await supabase
        .from('admins')
        .update({ 
          passwordhash: passwordHash,
          role: 'admin'
        })
        .eq('role', 'admin')
        .select();

      if (updateError) {
        console.error('❌ שגיאה בעדכון admin:', updateError);
        throw updateError;
      }
      
      console.log('✅ הסיסמה עודכנה בהצלחה!');
      console.log(`   ID: ${data[0].id}`);
    } else {
      console.log('➕ יוצר מנהל חדש...\n');
      
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
        if (insertError.code === '42P01') {
          console.error('\n⚠️  טבלת admins לא קיימת! צור אותה ב-Supabase.');
        }
        throw insertError;
      }
      
      console.log('✅ מנהל נוצר בהצלחה!');
      console.log(`   ID: ${data[0].id}`);
    }

    console.log('\n✅ ההגדרה הושלמה!\n');
    
    if (password) {
      console.log(`💡 ניתן כעת להתחבר עם הסיסמה: ${password}`);
    } else {
      console.log('💡 משתמש ב-hash הקיים מ-ADMIN_HASH');
      console.log('💡 כדי לבדוק מה הסיסמה, הרץ: node server/scripts/testAdminLogin.js');
    }
    
    console.log('\n📝 הוסף ל-server/.env (אופציונלי, fallback):');
    console.log(`ADMIN_HASH=${passwordHash}\n`);
    
    console.log('🧪 הרץ בדיקה:');
    console.log('   node server/scripts/testAdminLogin.js\n');

  } catch (err) {
    console.error('❌ שגיאה:', err.message || err);
    if (err.stack) {
      console.error('\nStack trace:', err.stack);
    }
    process.exit(1);
  }
}

// הרצה
if (require.main === module) {
  fixAdmin().catch(console.error);
}

module.exports = { fixAdmin };
