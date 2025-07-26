import { redirect } from "@remix-run/node";
import { useLoaderData, Form, Link } from "@remix-run/react";
import { useState } from "react";
import { getExpenseById, deleteExpense } from "~/lib/db.server";

export const loader = async ({ params }) => {
  const expense = await getExpenseById(Number(params.id));
  if (!expense) throw new Response("Not Found", { status: 404 });
  return { expense };
};

export const action = async ({ request, params }) => {
  const formData = await request.formData();
  const intent = formData.get("intent");

  if (intent === "delete") {
    await deleteExpense(Number(params.id));
  }

  return redirect("/");
};

export default function ConfirmDelete() {
  const { expense } = useLoaderData();
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
      onClick={() => (window.location.href = "/")}
    >
      <div
        className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-96 max-w-[90vw] space-y-4 transform transition-all duration-300 scale-100 opacity-100"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold text-center text-gray-800 dark:text-gray-200">
          Confirm Delete
        </h2>
        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Are you sure you want to delete this expense?
        </p>
        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded text-center">
          <p className="font-medium text-gray-800 dark:text-gray-200">
            {expense.description}
          </p>
          <p className="text-lg font-bold text-red-600">
            ₹{parseFloat(expense.amount).toFixed(2)}
          </p>
        </div>
        <div className="flex justify-center gap-4 pt-2">
          <Form method="post" onSubmit={() => setIsDeleting(true)}>
            <input type="hidden" name="intent" value="delete" />
            <button
              type="submit"
              disabled={isDeleting}
              className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </Form>
          <Link
            to={`/`}
            className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 px-6 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Cancel
          </Link>
        </div>
      </div>
    </div >
  );
}
