import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import toast from 'react-hot-toast';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const currentYear = new Date().getFullYear();
const YEARS = [currentYear - 1, currentYear, currentYear + 1];

function downloadPayslipPDF(p) {
  const doc = new jsPDF();
  const monthName = MONTHS[p.month - 1];
  doc.setFillColor(79, 70, 229);
  doc.rect(0, 0, 210, 28, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20); doc.setFont('helvetica', 'bold');
  doc.text('DAYFLOW', 14, 12);
  doc.setFontSize(9); doc.setFont('helvetica', 'normal');
  doc.text('Human Resource Management System', 14, 20);
  doc.setFontSize(11); doc.setFont('helvetica', 'bold');
  doc.text('PAYSLIP', 196, 12, { align: 'right' });
  doc.setFontSize(9); doc.setFont('helvetica', 'normal');
  doc.text(`${monthName} ${p.year}`, 196, 20, { align: 'right' });
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(11); doc.setFont('helvetica', 'bold');
  doc.text('Employee Details', 14, 38);
  doc.setDrawColor(229, 231, 235);
  doc.line(14, 40, 196, 40);
  const info = [['Employee Name', p.employeeName],['Employee ID', p.employeeId],['Pay Period', `${monthName} ${p.year}`],['Status', p.status.toUpperCase()]];
  doc.setFontSize(9); doc.setTextColor(71, 85, 105);
  info.forEach(([label, value], i) => {
    const x = i % 2 === 0 ? 14 : 110;
    const y = 48 + Math.floor(i / 2) * 8;
    doc.setFont('helvetica', 'bold'); doc.text(label + ':', x, y);
    doc.setFont('helvetica', 'normal'); doc.text(String(value), x + 38, y);
  });
  doc.setFontSize(11); doc.setFont('helvetica', 'bold'); doc.setTextColor(30, 41, 59);
  doc.text('Earnings Breakdown', 14, 74);
  doc.line(14, 76, 196, 76);
  autoTable(doc, {
    startY: 80,
    head: [['Description', 'Amount']],
    body: [['Basic Salary',`Rs.${p.basicSalary.toLocaleString()}`],['Bonuses',`+Rs.${p.bonuses.toLocaleString()}`],['Deductions',`-Rs.${p.deductions.toLocaleString()}`]],
    foot: [['Net Salary', `Rs.${p.netSalary.toLocaleString()}`]],
    styles: { fontSize: 9, cellPadding: 4 },
    headStyles: { fillColor: [79, 70, 229], textColor: 255, fontStyle: 'bold' },
    footStyles: { fillColor: [240, 253, 244], textColor: [22, 163, 74], fontStyle: 'bold', fontSize: 10 },
    columnStyles: { 1: { halign: 'right' } },
    margin: { left: 14, right: 14 },
  });
  const finalY = doc.lastAutoTable.finalY + 14;
  doc.setDrawColor(229, 231, 235); doc.line(14, finalY, 196, finalY);
  doc.setFontSize(8); doc.setTextColor(148, 163, 184); doc.setFont('helvetica', 'italic');
  doc.text('This is a system-generated payslip.', 105, finalY + 8, { align: 'center' });
  doc.save(`Payslip_${p.employeeId}_${monthName}_${p.year}.pdf`);
}

function exportPayrollCSV(payslips) {
  const header = ['Employee Name','Employee ID','Month','Year','Basic Salary','Deductions','Bonuses','Net Salary','Status'];
  const rows = payslips.map(p => [p.employeeName,p.employeeId,MONTHS[p.month-1],p.year,p.basicSalary,p.deductions,p.bonuses,p.netSalary,p.status]);
  const csv = [header,...rows].map(r => r.join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `payroll_export_${new Date().toISOString().slice(0,10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
}

function StatusBadge({ status }) {
  return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${status === 'issued' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'}`}>{status}</span>;
}

function EmployeeView() {
  const [payslips, setPayslips] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => { api.get('/payroll/me').then(({ data }) => setPayslips(data.data)).finally(() => setLoading(false)); }, []);
  return (
    <div className="max-w-3xl space-y-6">
      <h2 className="text-xl font-semibold text-neutral-800">My Payslips</h2>
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        {loading ? <p className="p-5 text-sm text-neutral-400">Loading...</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 text-xs text-neutral-500 uppercase">
                <tr>{['Month','Basic','Bonuses','Deductions','Net Salary','Status',''].map(h => <th key={h} className="px-4 py-3 text-left whitespace-nowrap">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {payslips.length === 0 && <tr><td colSpan={7} className="px-4 py-8 text-center text-neutral-400">No payslips yet</td></tr>}
                {payslips.map(p => (
                  <tr key={p._id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 font-medium">{MONTHS[p.month-1]} {p.year}</td>
                    <td className="px-4 py-3">Rs.{p.basicSalary.toLocaleString()}</td>
                    <td className="px-4 py-3 text-green-600">+Rs.{p.bonuses.toLocaleString()}</td>
                    <td className="px-4 py-3 text-red-500">-Rs.{p.deductions.toLocaleString()}</td>
                    <td className="px-4 py-3 font-semibold">Rs.{p.netSalary.toLocaleString()}</td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-4 py-3"><button onClick={() => downloadPayslipPDF(p)} className="text-xs bg-indigo-600 text-white px-3 py-1 rounded-lg hover:bg-indigo-700">Download PDF</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function AdminView() {
  const [payslips, setPayslips] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [issuing, setIssuing] = useState(null);
  const [form, setForm] = useState({ userId:'', month:'', year:currentYear, deductions:0, bonusPercent:0 });
  const fetchAll = () => { Promise.all([api.get('/payroll'),api.get('/users')]).then(([pr,ur]) => { setPayslips(pr.data.data); setEmployees(ur.data.data); }).finally(() => setLoading(false)); };
  useEffect(() => { fetchAll(); }, []);
  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const handleGenerate = async (e) => { e.preventDefault(); setGenerating(true); try { await api.post('/payroll/generate', form); toast.success('Payslip generated'); setForm({ userId:'', month:'', year:currentYear, deductions:0, bonusPercent:0 }); fetchAll(); } catch (err) { toast.error(err.response?.data?.message || 'Failed'); } finally { setGenerating(false); } };
  const handleIssue = async (id) => { setIssuing(id); try { await api.put(`/payroll/${id}/issue`); toast.success('Payslip issued'); fetchAll(); } catch { toast.error('Failed'); } finally { setIssuing(null); } };
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-neutral-800">Payroll Management</h2>
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm p-5">
        <h3 className="text-sm font-semibold text-neutral-700 mb-4">Generate Payslip</h3>
        <form onSubmit={handleGenerate} className="grid md:grid-cols-3 gap-4">
          <div className="md:col-span-3"><label className="text-sm font-medium text-neutral-700 block mb-1">Employee</label>
            <select name="userId" value={form.userId} onChange={handleChange} required className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Select employee...</option>
              {employees.filter(e => e.role === 'employee').map(e => <option key={e._id} value={e._id}>{e.name} ({e.employeeId})</option>)}
            </select>
          </div>
          <div><label className="text-sm font-medium text-neutral-700 block mb-1">Month</label>
            <select name="month" value={form.month} onChange={handleChange} required className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="">Select month...</option>
              {MONTHS.map((m,i) => <option key={i+1} value={i+1}>{m}</option>)}
            </select>
          </div>
          <div><label className="text-sm font-medium text-neutral-700 block mb-1">Year</label>
            <select name="year" value={form.year} onChange={handleChange} className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div><label className="text-sm font-medium text-neutral-700 block mb-1">Bonus (%)</label>
            <input type="number" name="bonusPercent" value={form.bonusPercent} onChange={handleChange} min={0} max={100} placeholder="e.g. 10" className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div><label className="text-sm font-medium text-neutral-700 block mb-1">Deductions (Rs.)</label>
            <input type="number" name="deductions" value={form.deductions} onChange={handleChange} min={0} className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="flex items-end"><button type="submit" disabled={generating} className="w-full bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-60">{generating ? 'Generating...' : 'Generate'}</button></div>
        </form>
      </div>
      <div className="bg-white rounded-xl border border-neutral-200 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-700">All Payslips</h3>
          {payslips.length > 0 && <button onClick={() => exportPayrollCSV(payslips)} className="text-xs bg-neutral-100 text-neutral-700 px-3 py-1.5 rounded-lg hover:bg-neutral-200 font-medium">Export CSV</button>}
        </div>
        {loading ? <p className="p-5 text-sm text-neutral-400">Loading...</p> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50 text-xs text-neutral-500 uppercase">
                <tr>{['Employee','Month','Basic','Bonus','Deduction','Net','Status','Actions'].map(h => <th key={h} className="px-4 py-3 text-left whitespace-nowrap">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {payslips.length === 0 && <tr><td colSpan={8} className="px-4 py-8 text-center text-neutral-400">No payslips yet</td></tr>}
                {payslips.map(p => (
                  <tr key={p._id} className="hover:bg-neutral-50">
                    <td className="px-4 py-3 font-medium text-neutral-800">{p.employeeName}<br /><span className="text-xs text-neutral-400">{p.employeeId}</span></td>
                    <td className="px-4 py-3">{MONTHS[p.month-1]} {p.year}</td>
                    <td className="px-4 py-3">Rs.{p.basicSalary.toLocaleString()}</td>
                    <td className="px-4 py-3 text-green-600">+Rs.{p.bonuses.toLocaleString()}</td>
                    <td className="px-4 py-3 text-red-500">-Rs.{p.deductions.toLocaleString()}</td>
                    <td className="px-4 py-3 font-semibold">Rs.{p.netSalary.toLocaleString()}</td>
                    <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
                    <td className="px-4 py-3"><div className="flex gap-2">
                      {p.status === 'draft' && <button onClick={() => handleIssue(p._id)} disabled={issuing===p._id} className="text-xs bg-indigo-600 text-white px-2 py-1 rounded hover:bg-indigo-700 disabled:opacity-50">{issuing===p._id?'...':'Issue'}</button>}
                      <button onClick={() => downloadPayslipPDF(p)} className="text-xs bg-neutral-100 text-neutral-700 px-2 py-1 rounded hover:bg-neutral-200">PDF</button>
                    </div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Payroll() {
  const { user } = useAuth();
  return user?.role === 'admin' ? <AdminView /> : <EmployeeView />;
}
