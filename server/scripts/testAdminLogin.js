/**
 * סקריפט לבדיקת חיבור Admin והשוואת סיסמאות
 * 
 * שימוש:
 * node server/scripts/testAdminLogin.js
 * 
 * או עם סיסמה לבדיקה:
 * TEST_PASSWORD=your_password node server/scripts/testAdminLogin.js
 */

require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });
const bcrypt = require('bcrypt');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;

console.log('🔍 בדיקת חיבור Admin...\n');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ חסר SUPABASE_URL או SUPABASE_KEY ב-.env');
  console.error('📝 ודא שיש לך ב-server/.env:');
  console.error('   SUPABASE_URL=...');
  console.error('   SUPABASE_KEY=... או SUPABASE_SERVICE_ROLE_KEY=...');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAdminLogin() {
  try {
    console.log('1️⃣  בודק חיבור ל-Supabase...');
    console.log(`   URL: ${supabaseUrl.substring(0, 30)}...`);
    console.log(`   Key: ${supabaseKey.substring(0, 20)}...\n`);

    console.log('2️⃣  קורא admin מ-Supabase...');
    const { data, error } = await supabase
      .from("admins")
      .select("*")
      .eq("role", "admin")
      .limit(1)
      .maybeSingle();

    if (error) {
      if (error.code === 'PGRST116' || error.message?.includes('relation') || error.message?.includes('does not exist')) {
        console.error('❌ טבלת admins לא קיימת או ריקה!');
        console.error('\n📋 צור את הטבלה ב-Supabase SQL Editor:');
        console.error(`
CREATE TABLE admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  passwordhash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
        `);
        console.error('\n💡 אחר כך הרץ: node server/scripts/createAdmin.js');
      } else {
        console.error('❌ שגיאה בקריאת admins:', error);
      }
      process.exit(1);
    }

    if (!data || !data.passwordhash) {
      console.error('❌ לא נמצא admin ב-Supabase!');
      console.error('💡 הרץ: node server/scripts/createAdmin.js');
      process.exit(1);
    }

    console.log('✅ נמצא admin ב-Supabase!');
    console.log(`   ID: ${data.id}`);
    console.log(`   Role: ${data.role}`);
    console.log(`   Hash: ${data.passwordhash.substring(0, 30)}...\n`);

    console.log('3️⃣  בודק ADMIN_HASH מ-.env...');
    const envHash = process.env.ADMIN_HASH;
    if (envHash) {
      console.log(`   ✅ נמצא ADMIN_HASH ב-.env`);
      console.log(`   Hash: ${envHash.substring(0, 30)}...`);
      
      if (envHash === data.passwordhash) {
        console.log('   ✅ ה-hash ב-.env תואם ל-hash ב-Supabase!\n');
      } else {
        console.log('   ⚠️  ה-hash ב-.env שונה מה-hash ב-Supabase');
        console.log('   💡 המערכת תשתמש ב-hash מ-Supabase\n');
      }
    } else {
      console.log('   ⚠️  לא נמצא ADMIN_HASH ב-.env');
      console.log('   💡 המערכת תשתמש ב-hash מ-Supabase\n');
    }

    console.log('4️⃣  בודק סיסמאות אפשריות...');
    const testPasswords = [
      '1234!1234',
      process.env.TEST_PASSWORD,
      '1234',
      'admin',
      'password'
    ].filter(Boolean);

    const hashFromDB = data.passwordhash;
    let foundMatch = false;

    for (const testPassword of testPasswords) {
      if (!testPassword) continue;
      
      const match = await bcrypt.compare(testPassword, hashFromDB);
      if (match) {
        console.log(`   ✅ נמצאה התאמה! הסיסמה היא: "${testPassword}"`);
        foundMatch = true;
        break;
      } else {
        console.log(`   ❌ "${testPassword}" - לא תואם`);
      }
    }

    if (!foundMatch) {
      console.log('\n   ⚠️  לא נמצאה התאמה לסיסמאות הנפוצות');
      console.log('   💡 נסה להריץ את הסקריפט עם סיסמה לבדיקה:');
      console.log('      TEST_PASSWORD=your_password node server/scripts/testAdminLogin.js');
    }

    console.log('\n5️⃣  בודק JWT_SECRET...');
    const jwtSecret = process.env.JWT_SECRET;
    if (jwtSecret) {
      console.log(`   ✅ JWT_SECRET קיים (${jwtSecret.length} תווים)`);
    } else {
      console.error('   ❌ JWT_SECRET חסר ב-.env!');
      console.error('   💡 הוסף ל-server/.env:');
      console.error('      JWT_SECRET=your_jwt_secret');
      console.error('   💡 ליצירה: node -e "console.log(require(\'crypto\').randomBytes(64).toString(\'hex\'))"');
    }

    console.log('\n✅ הבדיקה הושלמה!\n');
    console.log('📋 סיכום:');
    console.log(`   - Admin קיים: ✅`);
    console.log(`   - Hash תקין: ✅`);
    console.log(`   - JWT_SECRET: ${jwtSecret ? '✅' : '❌'}`);
    console.log(`   - סיסמה נמצאה: ${foundMatch ? '✅' : '❓'}`);
    
    if (foundMatch) {
      console.log('\n🎉 הכל תקין! תוכל להתחבר כמנהל.');
    } else {
      console.log('\n⚠️  לא נמצאה סיסמה תואמת. נסה ליצור admin חדש:');
      console.log('   node server/scripts/createAdmin.js');
    }

  } catch (err) {
    console.error('\n❌ שגיאה:', err.message || err);
    if (err.stack) {
      console.error('\nStack trace:', err.stack);
    }
    process.exit(1);
  }
}

// הרצה
if (require.main === module) {
  testAdminLogin().catch(console.error);
}

module.exports = { testAdminLogin };
