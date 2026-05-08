import { useState } from 'react';

export default function Repayments() {

  const [installments] = useState([
    {
      id: 1,
      amount: 250,
      dueDate: '2026-05-20',
      status: 'Pending',
    },
    {
      id: 2,
      amount: 300,
      dueDate: '2026-06-20',
      status: 'Paid',
    },
    {
      id: 3,
      amount: 450,
      dueDate: '2026-07-20',
      status: 'Pending',
    },
  ]);

  const handlePay = (id) => {
    alert(`Initiate payment for installment ${id}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-8">

      <div className="max-w-5xl mx-auto">

        <div className="mb-8">
          <h1 className="text-4xl font-bold">
            Repayments
          </h1>

          <p className="text-slate-400 mt-2">
            Manage your loan installments and payments.
          </p>
        </div>

        <div className="grid gap-6">

          {installments.map((item) => (
            <div
              key={item.id}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >

              <div>
                <h3 className="text-xl font-semibold">
                  Installment #{item.id}
                </h3>

                <p className="text-slate-400 mt-1">
                  Due Date: {item.dueDate}
                </p>
              </div>

              <div className="flex items-center gap-6">

                <div>
                  <p className="text-slate-400 text-sm">
                    Amount
                  </p>

                  <h4 className="text-2xl font-bold">
                    ${item.amount}
                  </h4>
                </div>

                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${
                    item.status === 'Paid'
                      ? 'bg-green-500/10 text-green-400 border border-green-500/20'
                      : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'
                  }`}
                >
                  {item.status}
                </span>

                {item.status !== 'Paid' && (
                  <button
                    onClick={() => handlePay(item.id)}
                    className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-medium transition-all"
                  >
                    Pay
                  </button>
                )}

              </div>
            </div>
          ))}

        </div>
      </div>
    </div>
  );
}