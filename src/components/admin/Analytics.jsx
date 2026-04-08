import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api';

export default function Analytics() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await api.get('/admin/analytics');
      if(response.data.success) {
        setAnalytics(response.data.data);
      }
    } catch(err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  if(loading) return <div className="p-4 text-center">Loading Analytics...</div>;
  if(!analytics) return <div className="p-4 text-center text-danger">Failed to load analytics</div>;

  return (
    <> 
<div className="d-flex align-items-start justify-content-between mb-4 flex-wrap gap-3">
  <div><h4 className="fw-800 mb-1">Reports &amp; Analytics</h4><p>Site performance overview</p></div>
  <button className="btn-primary-c"><i className="fa-solid fa-download"></i> Export Report</button>
</div>
<div className="row g-3 mb-4">
  <div className="col-sm-6 col-xl-3"><div className="stat-card-c"><div className="d-flex justify-content-between align-items-center mb-3"><div className="stat-icon-c" style={{background:'var(--blue-50)',color:'var(--blue-600)'}}><i className="fa-solid fa-eye"></i></div><span className="stat-delta-c up">↑ 12%</span></div><div className="stat-val-c">{analytics.pageViews || 0}</div><div className="stat-label-c">Page Views</div></div></div>
  <div className="col-sm-6 col-xl-3"><div className="stat-card-c"><div className="d-flex justify-content-between align-items-center mb-3"><div className="stat-icon-c" style={{background:'#ecfdf5',color:'var(--green)'}}><i className="fa-solid fa-user-check"></i></div><span className="stat-delta-c up">↑ 8%</span></div><div className="stat-val-c">{analytics.uniqueVisitors}</div><div className="stat-label-c">Unique Visitors</div></div></div>
  <div className="col-sm-6 col-xl-3"><div className="stat-card-c"><div className="d-flex justify-content-between align-items-center mb-3"><div className="stat-icon-c" style={{background:'#f5f3ff',color:'var(--purple)'}}><i className="fa-solid fa-clock"></i></div><span className="stat-delta-c up">↑ 3%</span></div><div className="stat-val-c">{analytics.avgSession}</div><div className="stat-label-c">Avg Session</div></div></div>
  <div className="col-sm-6 col-xl-3"><div className="stat-card-c"><div className="d-flex justify-content-between align-items-center mb-3"><div className="stat-icon-c" style={{background:'#fef2f2',color:'var(--red)'}}><i className="fa-solid fa-person-running"></i></div><span className="stat-delta-c down">↓ 1%</span></div><div className="stat-val-c">{analytics.bounceRate}</div><div className="stat-label-c">Bounce Rate</div></div></div>
</div>
<div className="card-custom">
  <div className="card-head-custom"><span className="card-title-c">Monthly Traffic Overview</span></div>
  <div className="p-3">
    <div className="chart-area" style={{display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', height: '250px', background: 'var(--gray-50)', border: '1px dashed var(--gray-300)', padding: '20px', borderRadius: '8px'}}>
      {/* Fake a bar chart using the distributions */}
      {analytics.monthlyTraffic && analytics.monthlyTraffic.map((d, i) => {
        const monthNames = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return (
        <div key={i} className="d-flex flex-column align-items-center" style={{width: '40px', height: '100%'}}>
           <div className="flex-grow-1 w-100 d-flex align-items-end justify-content-center">
             <div style={{width: '30px', height: `${Math.max(10, d.count * 10)}%`, background: 'var(--blue-500)', borderTopLeftRadius: '4px', borderTopRightRadius: '4px'}} title={`${monthNames[d._id] || d._id}: ${d.count} posts, ${d.views} views`}></div>
           </div>
           <div className="mt-2" style={{fontSize: '10px', color: 'var(--gray-500)'}}>{monthNames[d._id] || d._id}</div>
        </div>
        );
      })}
      {(!analytics.monthlyTraffic || analytics.monthlyTraffic.length === 0) && <div className="text-muted"><i className="fa-solid fa-chart-bar me-2"></i>No data points</div>}
    </div>
  </div>
</div>
  
    </>
  );
}
