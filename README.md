# 💸 Remix Expense Tracker

A simple, user-friendly Expense Tracker app built with **Remix**. This project allows users to record, view, edit, and delete their daily expenses with clean UI and full CRUD functionality.

---

## 📖 Remix Docs  
For more information on Remix, visit the official docs:  
👉 https://remix.run/docs

---

## 📦 Development

To get started locally:

```bash
git clone https://github.com/champalalsuthar/expense_tracker.git
cd expense_tracker
npm install
npm run dev
```

<!-- --- -->

<!-- ## 🚀 Deployment

First, build the app for production:

```bash
npm run build
```

Then run it in production mode:

```bash
npm start
```

Make sure to deploy the output of the build:

```
build/server
build/client
```

You can host the app on any Node-compatible service like Render, Railway, or Vercel (with Node adapter).

--- -->

## ✨ Features

- ✅ **Add New Expense**
    - Description
    - Amount (only numeric, up to 2 decimal places)
    - Category (dropdown from predefined list)
    - Date (defaults to today's date)
- 📋 **View All Expenses**
    - Table displays:
        - Description
        - Amount
        - Category
        - Date
    - Total expense shown at top
- 📝 **Edit Expense**
    - Loads the existing record
    - Pre-filled form
    - Form validation included
- 🗑️ **Delete Expense**
    - Remove an expense with confirmation prompt

---

## 🗂️ Project Structure

```
app/
├── routes/
│   ├── index.tsx         # Home - View expenses
│   ├── add.tsx           # Add new expense
│   ├── delete.$id.tsx    # Delete expense by ID
│   ├── edit.$id.tsx      # Edit expense by ID
├── lib/
│   └── db.server.ts      # Handles reading/writing to expenses.json
├── db/
│   └── expenses.json     # JSON-based storage
├── constant/
│   └── category.js       # Category options for expenses
├── root.tsx              # Main app layout and shell
├── tailwind.css          # Tailwind CSS and global styles
```

### 📂 constant/category.js

```js
const categories = [
    "Food",
    "Transport",
    "Bills",
    "Other"
];

export default categories;
```

---

## 🧑‍💻 Tech Stack

- **Framework:** Remix
- **Styling:** Tailwind CSS
- **Data Storage:** JSON file (can be migrated to SQLite)
- **Language:** TypeScript
- **Forms:** Native Remix `<Form method="post" />`
- **Validation:** Both client and server-side

