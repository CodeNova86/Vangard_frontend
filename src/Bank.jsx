import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE = 'http://localhost:3000/bank'; // تغییر به URL واقعی بک‌اند

const BankDashboard = () => {
  const [activeTab, setActiveTab] = useState('trade');
  const [transactions, setTransactions] = useState([]);
  const groupId = 1; // از context یا لاگین بگیرید

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const res = await axios.post(`${API_BASE}/get_group_trans`, { group_id: groupId });
      setTransactions(res.data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  const handleTabChange = (tab) => setActiveTab(tab);

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', padding: '20px' }}>
      <h1>داشبورد بانک ونگارد</h1>
      <nav>
        <button onClick={() => handleTabChange('trade')}>معامله (Trade)</button>
        <button onClick={() => handleTabChange('trust_fund')}>صندوق امانی (Trust Fund)</button>
        <button onClick={() => handleTabChange('set_loan')}>تنظیم وام (Set Loan)</button>
        <button onClick={() => handleTabChange('buy_spy_card')}>خرید کارت جاسوسی (Buy Spy Card)</button>
        <button onClick={() => handleTabChange('get_group_trans')}>تراکنش‌ها (Transactions)</button>
      </nav>
      {activeTab === 'trade' && <TradeForm groupId={groupId} refreshTransactions={fetchTransactions} />}
      {activeTab === 'trust_fund' && <TrustFundForm groupId={groupId} refreshTransactions={fetchTransactions} />}
      {activeTab === 'set_loan' && <LoanForm groupId={groupId} refreshTransactions={fetchTransactions} />}
      {activeTab === 'buy_spy_card' && <SpyCardForm groupId={groupId} refreshTransactions={fetchTransactions} />}
      {activeTab === 'get_group_trans' && <TransactionsList transactions={transactions} />}
    </div>
  );
};

const TradeForm = ({ groupId, refreshTransactions }) => {
  const [resourceType, setResourceType] = useState('oil');
  const [amount, setAmount] = useState(0);
  const [action, setAction] = useState('buy'); // buy or sell
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dto = { group_id: groupId, resource: resourceType, amount, type: action };
      const res = await axios.post(`${API_BASE}/trade`, dto);
      setMessage(`معامله موفق: ${res.data.message}`);
      refreshTransactions();
    } catch (err) {
      setMessage('خطا در معامله: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>معامله منابع</h2>
      <select value={resourceType} onChange={(e) => setResourceType(e.target.value)}>
        <option value="oil">نفت</option>
        <option value="wood">چوب</option>
        <option value="stone">سنگ</option>
        <option value="crystal">کریستال</option>
        <option value="strenium">استرنیوم</option>
      </select>
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="مقدار" required />
      <select value={action} onChange={(e) => setAction(e.target.value)}>
        <option value="buy">خرید</option>
        <option value="sell">فروش</option>
      </select>
      <button type="submit">اجرا</button>
      <p>{message}</p>
    </form>
  );
};

const TrustFundForm = ({ groupId, refreshTransactions }) => {
  const [action, setAction] = useState('add'); // add or delete
  const [amount, setAmount] = useState(0);
  const [fundId, setFundId] = useState(null); // برای delete
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dto = { group_id: groupId, action, amount, fund_id: fundId };
      const res = await axios.post(`${API_BASE}/trust_fund`, dto);
      setMessage(`عملیات موفق: ${res.data.message}`);
      refreshTransactions();
    } catch (err) {
      setMessage('خطا: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>مدیریت صندوق امانی</h2>
      <select value={action} onChange={(e) => setAction(e.target.value)}>
        <option value="add">اضافه کردن</option>
        <option value="delete">حذف</option>
      </select>
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="مقدار (برای add)" />
      {action === 'delete' && <input type="number" value={fundId} onChange={(e) => setFundId(e.target.value)} placeholder="ID صندوق" required />}
      <button type="submit">اجرا</button>
      <p>{message}</p>
    </form>
  );
};

const LoanForm = ({ groupId, refreshTransactions }) => {
  const [amount, setAmount] = useState(0);
  const [duration, setDuration] = useState(1); // مثلاً ماه
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dto = { group_id: groupId, amount, duration };
      const res = await axios.post(`${API_BASE}/set_loan`, dto);
      setMessage(`وام تنظیم شد: ${res.data.message}`);
      refreshTransactions();
    } catch (err) {
      setMessage('خطا: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>تنظیم وام</h2>
      <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="مقدار وام" required />
      <input type="number" value={duration} onChange={(e) => setDuration(e.target.value)} placeholder="مدت (ماه)" required />
      <button type="submit">درخواست</button>
      <p>{message}</p>
    </form>
  );
};

const SpyCardForm = ({ groupId, refreshTransactions }) => {
  const [type, setType] = useState('information'); // information, market, sabotage
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dto = { group_id: groupId, type };
      const res = await axios.post(`${API_BASE}/buy_spy_card`, dto);
      setMessage(`کارت خریداری شد: ${res.data.message}`);
      refreshTransactions();
    } catch (err) {
      setMessage('خطا: ' + err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>خرید کارت جاسوسی</h2>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="information">اطلاعاتی</option>
        <option value="market">اقتصادی</option>
        <option value="sabotage">تخریبی</option>
      </select>
      <button type="submit">خرید</button>
      <p>{message}</p>
    </form>
  );
};

const TransactionsList = ({ transactions }) => {
  return (
    <div>
      <h2>لیست تراکنش‌های گروه</h2>
      <ul>
        {transactions.map((trans, index) => (
          <li key={index}>{`${trans.type}: ${trans.amount} - ${trans.date}`}</li>
        ))}
      </ul>
    </div>
  );
};

export default BankDashboard;