import { json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, Link, Form, useSearchParams, useNavigation } from "@remix-run/react";
import { deleteExpense, getExpenses } from "~/lib/db.server";
import { useEffect, useRef } from "react";
import Chart from 'chart.js/auto';
import categories from "~/constant/category";

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const start = url.searchParams.get("start");
    const end = url.searchParams.get("end");
    const category = url.searchParams.get("category");

    let expenses = await getExpenses();

    if (start && end && new Date(end) < new Date(start)) {
        return json({ expenses: [], total: 0 });
    } else {
        if (start) expenses = expenses.filter(e => new Date(e.date) >= new Date(start));
        if (end) expenses = expenses.filter(e => new Date(e.date) <= new Date(end));
    }
    if (category) {
        expenses = expenses.filter(e => e.category === category);
    }

    const total = expenses.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0);
    return json({ expenses, total });
};

export const action = async ({ request }) => {
    const formData = await request.formData();
    const id = formData.get("id");
    if (id) {
        await deleteExpense(Number(id));
    }
    return json({ success: true });
};

export default function Index() {
    const { expenses, total } = useLoaderData();
    const [searchParams, setSearchParams] = useSearchParams();
    const chartRef = useRef(null);

    useEffect(() => {
        if (!chartRef.current) return;

        const ctx = chartRef.current.getContext("2d");
        if (!ctx) return;

        const categoryTotals = expenses.reduce((acc, curr) => {
            acc[curr.category] = (acc[curr.category] || 0) + parseFloat(curr.amount);
            return acc;
        }, {});

        const chart = new Chart(ctx, {
            type: 'pie',
            data: {
                labels: Object.keys(categoryTotals),
                datasets: [{
                    data: Object.values(categoryTotals),
                    backgroundColor: ['#60a5fa', '#f87171', '#34d399', '#facc15']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
            },
        });

        return () => {
            chart.destroy();
        };
    }, [expenses])

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Expense Tracker</h1>
                <Link to="/add" className="text-white px-4 py-2 rounded shadow bg-blue-500 hover:bg-blue-600">
                    + Add Expense
                </Link>
            </div>

            <Form method="get" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                <input
                    type="date"
                    name="start"
                    defaultValue={searchParams.get("start") || ""}
                    className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="date"
                    name="end"
                    defaultValue={searchParams.get("end") || ""}
                    className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                    name="category"
                    defaultValue={searchParams.get("category") || ""}
                    className="border p-2 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="">All Categories</option>
                    {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>
                <div className="flex gap-2">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white w-full rounded p-2 hover:bg-blue-600 transition-colors"
                    >
                        Apply
                    </button>
                    <Link
                        to="/"
                        className="bg-gray-200 hover:bg-gray-300 p-2 rounded w-full text-center transition-colors"
                    >
                        Reset
                    </Link>
                </div>
            </Form>

            <p className="text-xl font-semibold mb-2">Total Spent: {total.toFixed(2)} ₹</p>

            <div className="overflow-x-auto">
                <table className="w-full border text-sm shadow rounded overflow-hidden">
                    <thead className="bg-gray-100 text-center">
                        <tr>
                            <th className="p-3 border">Description</th>
                            <th className="p-3 border">Amount (₹)</th>
                            <th className="p-3 border">Category</th>
                            <th className="p-3 border">Date</th>
                            <th className="p-3 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {expenses.length > 0 ? (
                            expenses.map((expense) => (
                                <tr key={expense.id} className="text-center border-t hover:bg-gray-50">
                                    <td className="p-3">{expense.description}</td>
                                    <td className="p-3">{parseFloat(expense.amount).toFixed(2)} ₹</td>
                                    <td className="p-3">{expense.category}</td>
                                    <td className="p-3">{expense.date}</td>
                                    <td className="p-3">
                                        <div className="flex justify-center gap-2">
                                            <Link
                                                to={`/edit/${expense.id}`}
                                                className="text-blue-500 hover:text-blue-700 underline transition-colors"
                                            >
                                                Edit
                                            </Link>
                                            <Link
                                                to={`/delete/${expense.id}`}
                                                className="text-red-500 hover:text-red-700 underline transition-colors cursor-pointer"
                                            >
                                                Delete
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center p-4 text-gray-500">
                                    No expenses found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}