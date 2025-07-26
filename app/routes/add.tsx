import { redirect, json } from "@remix-run/node";
import { Form, Link, useActionData } from "@remix-run/react";
import { useState } from "react";
import { addExpense } from "~/lib/db.server";
import categories from "~/constant/category";

export const action = async ({ request }) => {
    const formData = await request.formData();
    const data = Object.fromEntries(formData);

    const errors: Record<string, string> = {};

    if (!data.description) {
        errors.description = "Description is required";
    } else if (!/^[a-zA-Z0-9\s]+$/.test(data.description)) {
        errors.description = "No special characters allowed in description";
    }

    if (!data.amount) {
        errors.amount = "Amount is required";
    } else if (!/^\d+(\.\d{1,2})?$/.test(data.amount)) {
        errors.amount = "Amount must be a number up to 2 decimal places";
    }

    if (!data.category) errors.category = "Category is required";
    if (!data.date) errors.date = "Date is required";

    if (Object.keys(errors).length > 0) {
        return json({ errors, values: data }, { status: 400 });
    }

    const formattedData = {
        ...data,
        amount: parseFloat(data.amount).toFixed(2),
    };

    await addExpense(formattedData);
    return redirect("/");
};

export default function AddExpense() {
    const actionData = useActionData();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fields, setFields] = useState({
        description: actionData?.values?.description || "",
        amount: actionData?.values?.amount || "",
        category: actionData?.values?.category || "",
        date: actionData?.values?.date || new Date().toISOString().slice(0, 10),
    });

    const [errors, setErrors] = useState(actionData?.errors || {});

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "description" && !/^[a-zA-Z0-9\s]*$/.test(value)) return;
        if (name === "amount") {
            const regex = /^\d*\.?\d{0,2}$/;
            if (!regex.test(value)) return;
            setFields((prev) => ({ ...prev, [name]: value }));
            return;
        }

        setFields((prev) => ({ ...prev, [name]: value }));

        if (errors[name] && value.trim() !== "") {
            setErrors((prev) => {
                const updated = { ...prev };
                delete updated[name];
                return updated;
            });
        }
    };


    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-2xl font-bold mb-6 text-center">Add New Expense</h1>

            <Form
                method="post"
                className="space-y-5 bg-white dark:bg-gray-800 shadow p-6 rounded"
                onSubmit={() => setIsSubmitting(true)}
            >
                {/* Description */}
                <div>
                    <label className="block mb-1 font-medium">Description</label>
                    <input
                        name="description"
                        value={fields.description}
                        onChange={handleChange}
                        placeholder="Description"
                        className={`w-full border p-2 rounded focus:outline-none focus:ring ${errors.description ? "border-red-500" : "border-gray-300"
                            }`}
                    />
                    {errors.description && (
                        <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                    )}
                </div>

                {/* Amount */}
                <div>
                    <label className="block mb-1 font-medium">Amount (₹)</label>
                    <input
                        name="amount"
                        type="text"
                        value={fields.amount}
                        onChange={handleChange}
                        placeholder="Amount"
                        className={`w-full border p-2 rounded focus:outline-none focus:ring ${errors.amount ? "border-red-500" : "border-gray-300"
                            }`}
                    />


                    {errors.amount && (
                        <p className="text-red-500 text-sm mt-1">{errors.amount}</p>
                    )}
                </div>

                {/* Category */}
                <div>
                    <label className="block mb-1 font-medium">Category</label>
                    <select
                        name="category"
                        value={fields.category}
                        onChange={handleChange}
                        className={`w-full border p-2 rounded focus:outline-none focus:ring ${errors.category ? "border-red-500" : "border-gray-300"
                            }`}
                    >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    {errors.category && (
                        <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                    )}
                </div>

                {/* Date */}
                <div>
                    <label className="block mb-1 font-medium">Date</label>
                    <input
                        name="date"
                        type="date"
                        value={fields.date}
                        onChange={handleChange}
                        className={`w-full border p-2 rounded focus:outline-none focus:ring ${errors.date ? "border-red-500" : "border-gray-300"
                            }`}
                    />
                    {errors.date && (
                        <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                    )}
                </div>

                {/* Submit Button */}


                <div className="flex justify-between items-center gap-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`flex-1 bg-blue-600 text-white py-2 px-4 rounded transition ${isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
                            }`}
                    >
                        {isSubmitting ? "Submitting..." : "Submit"}
                    </button>

                    <Link
                        to="/"
                        className="flex-1 text-center bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                    >
                        Cancel
                    </Link>
                </div>
            </Form>
        </div>
    );
}
