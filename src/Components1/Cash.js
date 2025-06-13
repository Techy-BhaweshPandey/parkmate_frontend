import React, { useState } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { jsPDF } from "jspdf";
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const IncomeCalculator = () => {
  const { message6 } = useParams();
  const [income, setIncome] = useState('');
  const [incomeList, setIncomeList] = useState([]);
  const [totalIncome, setTotalIncome] = useState(null);
  const [viewIncomeVisible, setViewIncomeVisible] = useState(false);
  const [incomeRecords, setIncomeRecords] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [hasFetched, setHasFetched] = useState(false);

  const handleIncomeChange = (e) => setIncome(e.target.value);

  const addIncome = () => {
    if (income && !isNaN(income) && income > 0) {
      setIncomeList([...incomeList, parseFloat(income)]);
      setIncome('');
    } else {
      toast.error("Please enter a valid income to calculate");
    }
  };

  const calculateTotalIncome = async () => {
    const sum = incomeList.reduce((acc, curr) => acc + curr, 0);
    setTotalIncome(sum);

    try {
      const response = await fetch('https://parkmate-back-3.onrender.com/save-income', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ parkingCode: message6, incomeList, totalIncome: sum }),
      });

      const data = await response.json();
      if (response.ok) toast.success("Income calculated successfully");
      else alert(`❌ Failed to save: ${data.message}`);
    } catch (error) {
      console.error('Error saving income data:', error);
      alert('❌ Could not connect to backend.');
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Total Income Overview',
        font: { size: 16, weight: 'bold' },
      }
    },
    scales: {
      x: { title: { display: true, text: 'Record' } },
      y: { title: { display: true, text: 'Amount ($)' }, beginAtZero: true },
    },
  };

  const downloadPDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    doc.setFontSize(16);
    doc.text("Total Income Overview", 20, 20);

    const canvas = document.querySelector("#myChart canvas");
    if (canvas) {
      const imgData = canvas.toDataURL("image/png");
      doc.addImage(imgData, "PNG", 15, 30, 180, 100); // Adjust size for fit
      doc.save("total_income_chart.pdf");
    } else {
      toast.error("Chart not available for download");
    }
  };

  const toggleViewIncome = () => setViewIncomeVisible(!viewIncomeVisible);

  const fetchIncomeRecords = async () => {
    setHasFetched(true);
    try {
      const response = await fetch(`https://parkmate-back-3.onrender.com/all-income?parkingCode=${message6}`);
      const data = await response.json();

      if (response.ok) {
        const filtered = data.filter(item => {
          const matchesDate = filterDate
            ? new Date(item.createdAt).toISOString().slice(0, 10) === filterDate
            : true;
          return matchesDate;
        });
        setIncomeRecords(filtered);
      } else {
        toast.error("Failed to fetch income records");
      }
    } catch (error) {
      console.error('Error fetching income records:', error);
      toast.error("Error connecting to backend");
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Income Calculator</h1>

      <div style={styles.inputSection}>
        <input
          type="number"
          value={income}
          onChange={handleIncomeChange}
          style={styles.incomeInput}
          placeholder="Enter your income"
        />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
          <button onClick={addIncome} style={styles.addButton}>Add</button>
          <button onClick={toggleViewIncome} style={styles.viewButton}>
            {viewIncomeVisible ? "Hide Income Details" : "View Income"}
          </button>
        </div>
      </div>

      {incomeList.length > 0 && (
        <div style={styles.incomeList}>
          <h3>Income Entries</h3>
          <ul style={styles.list}>
            {incomeList.map((item, index) => (
              <li key={index} style={styles.listItem}>${item.toFixed(2)}</li>
            ))}
          </ul>
        </div>
      )}

      {incomeList.length > 0 && (
        <button onClick={calculateTotalIncome} style={styles.calculateButton}>
          Calculate Total
        </button>
      )}

      {totalIncome !== null && (
        <div style={styles.resultSection}>
          <p style={styles.resultText}><strong>Total Income: </strong> ${totalIncome.toFixed(2)}</p>
        </div>
      )}

      {viewIncomeVisible && (
        <div style={{ marginTop: '30px', textAlign: 'left' }}>
          <h3 style={{ marginBottom: '10px' }}>View Income Details</h3>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '20px' }}>
            <input
              type="date"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              style={styles.incomeInput}
            />
            <button onClick={fetchIncomeRecords} style={styles.calculateButton}>View Income</button>
          </div>

          {incomeRecords.length > 0 && (
            <>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr>
                    <th style={styles.tableHeader}>Date</th>
                    <th style={styles.tableHeader}>Total Income</th>
                    <th style={styles.tableHeader}>Entries</th>
                  </tr>
                </thead>
                <tbody>
                  {incomeRecords.map((record, idx) => (
                    <tr key={idx}>
                      <td style={styles.tableCell}>{new Date(record.createdAt).toLocaleDateString()}</td>
                      <td style={styles.tableCell}>${record.totalIncome.toFixed(2)}</td>
                      <td style={styles.tableCell}>{record.incomeList.join(', ')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div style={styles.chartSection} id="myChart">
                <h3 style={{ marginTop: '30px' }}>Total Incomes Overview</h3>
                <div style={{ width: '100%', height: '300px' }}>
                  <Bar
                    data={{
                      labels: incomeRecords.map((r, i) => `Record ${i + 1}`),
                      datasets: [{
                        label: 'Total Income',
                        data: incomeRecords.map(r => r.totalIncome),
                        backgroundColor: 'rgba(75, 192, 192, 0.5)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                      }]
                    }}
                    options={chartOptions}
                  />
                </div>
                <button onClick={downloadPDF} style={styles.downloadButton}>Download PDF</button>
              </div>
            </>
          )}

          {hasFetched && incomeRecords.length === 0 && <p>No income records found.</p>}
        </div>
      )}

      <ToastContainer autoClose={1500} position="top-right" />
    </div>
  );
};

const styles = {
  container: {
    width: '90%',
    maxWidth: '1000px',
    margin: '80px auto',
    padding: '20px',
    borderRadius: '10px',
    backgroundColor: '#f5f5f5',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
  },
  heading: {
    textAlign: 'center',
    fontSize: '2em',
    marginBottom: '30px',
    color: '#333',
  },
  inputSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    marginBottom: '20px',
  },
  incomeInput: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ddd',
    minWidth: '200px',
  },
  addButton: {
    padding: '12px 20px',
    fontSize: '16px',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  viewButton: {
    padding: '12px 20px',
    fontSize: '16px',
    backgroundColor: '#9C27B0',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  },
  calculateButton: {
    padding: '12px 30px',
    fontSize: '16px',
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
  },
  incomeList: {
    marginTop: '20px',
  },
  list: {
    listStyleType: 'none',
    padding: '0',
  },
  listItem: {
    fontSize: '16px',
    marginBottom: '10px',
  },
  resultSection: {
    marginTop: '20px',
    textAlign: 'center',
  },
  resultText: {
    fontSize: '18px',
    fontWeight: 'bold',
  },
  tableHeader: {
    padding: '12px',
    backgroundColor: '#f2f2f2',
  },
  tableCell: {
    padding: '12px',
    textAlign: 'center',
  },
  chartSection: {
    marginTop: '30px',
    textAlign: 'center',
  },
  downloadButton: {
    marginTop: '15px',
    padding: '10px 20px',
    backgroundColor: '#28A745',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    cursor: 'pointer',
  }
};

export default IncomeCalculator;
