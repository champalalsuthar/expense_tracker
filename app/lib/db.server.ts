import fs from 'fs/promises';
import path from 'path';

const dbPath = path.resolve('app/db/expenses.json');

export async function getExpenses() {
  const data = await fs.readFile(dbPath, 'utf-8');
  return JSON.parse(data);
}

export async function addExpense(expense) {
  const expenses = await getExpenses();
  const newExpense = { id: Date.now(), ...expense };
  expenses.push(newExpense);
  await fs.writeFile(dbPath, JSON.stringify(expenses, null, 2));
  return newExpense;
}

export async function getExpenseById(id) {
  const expenses = await getExpenses();
  return expenses.find(e => e.id === Number(id));
}

export async function updateExpense(id, data) {
  const expenses = await getExpenses();
  const updated = expenses.map(e =>
    e.id === Number(id) ? { ...e, ...data } : e
  );
  await fs.writeFile(dbPath, JSON.stringify(updated, null, 2));
}

export async function deleteExpense(id) {
  const expenses = await getExpenses();
  const filtered = expenses.filter(e => e.id !== Number(id));
  await fs.writeFile(dbPath, JSON.stringify(filtered, null, 2));
}
