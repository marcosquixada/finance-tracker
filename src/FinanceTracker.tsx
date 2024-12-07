import React, { useState } from 'react';
import { Plus } from 'lucide-react';

interface Transaction {
  id: number;
  description: string;
  amount: number;
  type: 'expense' | 'income';
  category: string;
  date: string;
}

interface TransactionInput {
  description: string;
  amount: string;
  type: 'expense' | 'income';
  category: string;
}

const FinanceTracker: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newTransaction, setNewTransaction] = useState<TransactionInput>({
    description: '',
    amount: '',
    type: 'expense',
    category: 'other'
  });

  const addTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(newTransaction.amount);
    if (!newTransaction.description || isNaN(amount)) return;

    setTransactions([
      ...transactions,
      {
        ...newTransaction,
        id: Date.now(),
        amount: newTransaction.type === 'expense' ? -amount : amount,
        date: new Date().toISOString()
      }
    ]);

    setNewTransaction({
      description: '',
      amount: '',
      type: 'expense',
      category: 'other'
    });
  };

  const getBalance = (): number => {
    return transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
  };

  const categories = ['alimentação', 'transporte', 'lazer', 'contas', 'outros'];

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h1 className="text-2xl font-bold mb-4">Controle Financeiro</h1>
        <div className="text-2xl mb-6">
          Saldo: <span className={getBalance() >= 0 ? 'text-green-600' : 'text-red-600'}>
            R$ {getBalance().toFixed(2)}
          </span>
        </div>

        <form onSubmit={addTransaction} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Descrição"
              className="w-full p-2 border rounded"
              value={newTransaction.description}
              onChange={(e) => setNewTransaction({...newTransaction, description: e.target.value})}
            />
            <input
              type="number"
              placeholder="Valor"
              className="w-full p-2 border rounded"
              value={newTransaction.amount}
              onChange={(e) => setNewTransaction({...newTransaction, amount: e.target.value})}
            />
            <select
              className="w-full p-2 border rounded"
              value={newTransaction.type}
              onChange={(e) => setNewTransaction({...newTransaction, type: e.target.value as 'expense' | 'income'})}
            >
              <option value="expense">Despesa</option>
              <option value="income">Receita</option>
            </select>
            <select
              className="w-full p-2 border rounded"
              value={newTransaction.category}
              onChange={(e) => setNewTransaction({...newTransaction, category: e.target.value})}
            >
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white p-2 rounded flex items-center justify-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Adicionar Transação
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold mb-4">Transações Recentes</h2>
        <div className="space-y-2">
          {transactions.map(transaction => (
            <div
              key={transaction.id}
              className="p-3 border rounded flex justify-between items-center hover:bg-gray-50"
            >
              <div>
                <div className="font-medium">{transaction.description}</div>
                <div className="text-sm text-gray-500">{transaction.category}</div>
              </div>
              <div className={transaction.amount >= 0 ? 'text-green-600' : 'text-red-600'}>
                R$ {Math.abs(transaction.amount).toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FinanceTracker;