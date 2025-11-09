# הוראות חיבור לגיט

## חיבור הפרויקט ל-Git

הפרויקט כבר מוכן לחיבור לגיט עם קובץ `.gitignore` מוגדר.

### שלבים:

1. **אתחול repository (אם עדיין לא):**
   ```bash
   git init
   ```

2. **הוספת כל הקבצים:**
   ```bash
   git add .
   ```

3. **יצירת commit ראשון:**
   ```bash
   git commit -m "Initial commit - ועד מבקשי השם"
   ```

4. **חיבור ל-remote repository (אם יש):**
   ```bash
   git remote add origin <your-repo-url>
   git branch -M main
   git push -u origin main
   ```

### קבצים שלא יועלו לגיט (מוגדרים ב-.gitignore):

- `node_modules/`
- `.env` files
- `build/` directories
- קבצי log
- קבצי IDE

**חשוב:** ודא שקובץ `.env` לא נשמר בגיט! הוא מכיל מידע רגיש.

