import React, { useState, useEffect, useMemo } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { Card, ButtonGroup, Button, Dropdown } from 'react-bootstrap';
import { Icon } from "@iconify/react";
import axios from '../../../api/axios';

const PaymentAnalyticsGraph = () => {
  // Time period state
  const [timePeriod, setTimePeriod] = useState('monthly');
  const [chartType, setChartType] = useState('line');
  const [paymentData, setPaymentData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch payment data from API
  const fetchPaymentData = async (period = timePeriod) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/admin/dashboard/payments-data?period=${period}&limit=30`);
      const apiData = response.data.data || [];
      
      // Transform API data to match chart format
      const transformedData = apiData.map(item => {
        const periodKey = period === 'daily' ? 'date' : 
                         period === 'weekly' ? 'week' : 
                         period === 'monthly' ? 'month' : 'year';
        
        return {
          [periodKey]: item.period,
          revenue: parseFloat(item.total) || 0,
          transactions: item.count || 0,
          avgRevenue: item.count > 0 ? Math.round(parseFloat(item.total) / item.count) : 0
        };
      }).reverse(); // Reverse to show chronological order

      setPaymentData(transformedData);
    } catch (err) {
      console.error('Error fetching payment data:', err);
      setError('Failed to load payment data');
      // Fallback to empty data
      setPaymentData([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when component mounts or time period changes
  useEffect(() => {
    fetchPaymentData();
  }, [timePeriod]);

  // Chart configuration
  const chartConfig = {
    daily: { xKey: 'date', xLabel: 'Days' },
    weekly: { xKey: 'week', xLabel: 'Weeks' },
    monthly: { xKey: 'month', xLabel: 'Months' },
    yearly: { xKey: 'year', xLabel: 'Years' }
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip bg-white p-3 border rounded shadow">
          <p className="label mb-2"><strong>{label}</strong></p>
          {payload.map((entry, index) => (
            <p key={index} className="mb-1" style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('revenue') ? '$' : ''}{entry.value}
              {entry.name.includes('revenue') ? '' : entry.name.includes('avgRevenue') ? ' USD' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Render chart based on type
  const renderChart = () => {
    const { xKey, xLabel } = chartConfig[timePeriod];
    
    switch(chartType) {
      case 'bar':
        return (
          <BarChart data={paymentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} label={{ value: xLabel, position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="revenue" name="Revenue" fill="#8884d8" />
            <Bar dataKey="transactions" name="Transactions" fill="#82ca9d" />
          </BarChart>
        );
      
      case 'area':
        return (
          <AreaChart data={paymentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#8884d8" fill="#8884d8" fillOpacity={0.3} />
            <Area type="monotone" dataKey="transactions" name="Transactions" stroke="#82ca9d" fill="#82ca9d" fillOpacity={0.3} />
          </AreaChart>
        );
      
      default: // line chart
        return (
          <LineChart data={paymentData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={xKey} label={{ value: xLabel, position: 'insideBottom', offset: -5 }} />
            <YAxis label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line type="monotone" dataKey="revenue" name="Revenue" stroke="#8884d8" strokeWidth={2} dot={{ r: 4 }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="transactions" name="Transactions" stroke="#82ca9d" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="avgRevenue" name="Avg. Transaction Size" stroke="#ffc658" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        );
    }
  };

  // Stats summary
  const statsSummary = useMemo(() => {
    const totalRevenue = paymentData.reduce((sum, item) => sum + item.revenue, 0);
    const totalTransactions = paymentData.reduce((sum, item) => sum + item.transactions, 0);
    const avgRevenue = Math.round(totalRevenue / paymentData.length);
    
    return { totalRevenue, totalTransactions, avgRevenue };
  }, [paymentData]);

  return (
    <Card className="border h-100 w-100 position-relative">
      <Card.Body className="position-relative">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h5 className="mb-1">Payment Analytics</h5>
            <p className="text-muted mb-0">Track your revenue and transactions</p>
          </div>
          
          <div className="d-flex gap-2">
            {/* Chart Type Selector */}
            <Dropdown>
              <Dropdown.Toggle variant="outline-secondary" size="sm">
                <Icon icon="mdi:chart-line" className="me-1" />
                {chartType === 'line' ? 'Line Chart' : chartType === 'bar' ? 'Bar Chart' : 'Area Chart'}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={() => setChartType('line')}>
                  <Icon icon="mdi:chart-line" className="me-2" /> Line Chart
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setChartType('bar')}>
                  <Icon icon="mdi:chart-bar" className="me-2" /> Bar Chart
                </Dropdown.Item>
                <Dropdown.Item onClick={() => setChartType('area')}>
                  <Icon icon="mdi:chart-areaspline" className="me-2" /> Area Chart
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            {/* Time Period Selector */}
            <ButtonGroup size="sm">
              <Button 
                variant={timePeriod === 'daily' ? 'primary' : 'outline-primary'}
                onClick={() => setTimePeriod('daily')}
              >
                Daily
              </Button>
              <Button 
                variant={timePeriod === 'weekly' ? 'primary' : 'outline-primary'}
                onClick={() => setTimePeriod('weekly')}
              >
                Weekly
              </Button>
              <Button 
                variant={timePeriod === 'monthly' ? 'primary' : 'outline-primary'}
                onClick={() => setTimePeriod('monthly')}
              >
                Monthly
              </Button>
              <Button 
                variant={timePeriod === 'yearly' ? 'primary' : 'outline-primary'}
                onClick={() => setTimePeriod('yearly')}
              >
                Yearly
              </Button>
            </ButtonGroup>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="card border-0 bg-light">
              <div className="card-body text-center">
                <h6 className="text-muted mb-2">Total Revenue</h6>
                <h3 className="mb-0">${statsSummary.totalRevenue.toLocaleString()}</h3>
                <small className="text-success">
                  <Icon icon="mdi:trending-up" /> 12.5% increase
                </small>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 bg-light">
              <div className="card-body text-center">
                <h6 className="text-muted mb-2">Total Transactions</h6>
                <h3 className="mb-0">{statsSummary.totalTransactions.toLocaleString()}</h3>
                <small className="text-success">
                  <Icon icon="mdi:trending-up" /> 8.3% increase
                </small>
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="card border-0 bg-light">
              <div className="card-body text-center">
                <h6 className="text-muted mb-2">Avg. Revenue</h6>
                <h3 className="mb-0">${statsSummary.avgRevenue.toLocaleString()}</h3>
                <small className="text-warning">
                  <Icon icon="mdi:trending-neutral" /> 2.1% change
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Chart Container */}
        <div style={{ width: '100%', height: 300 }}>
          {loading ? (
            <div className="d-flex justify-content-center align-items-center h-100">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : error ? (
            <div className="d-flex justify-content-center align-items-center h-100">
              <div className="text-center">
                <Icon icon="mdi:alert-circle" className="text-danger mb-2" style={{ fontSize: '2rem' }} />
                <p className="text-muted">{error}</p>
              </div>
            </div>
          ) : paymentData.length === 0 ? (
            <div className="d-flex justify-content-center align-items-center h-100">
              <div className="text-center">
                <Icon icon="mdi:chart-line" className="text-muted mb-2" style={{ fontSize: '2rem' }} />
                <p className="text-muted">No payment data available</p>
              </div>
            </div>
          ) : (
            <ResponsiveContainer>
              {renderChart()}
            </ResponsiveContainer>
          )}
        </div>

        {/* Export/Additional Options */}
        <div className="d-flex justify-content-between align-items-center mt-4">
          <div className="text-muted small">
            <Icon icon="mdi:information" className="me-1" />
            Data updates in real-time
          </div>
          <div>
            {/* <button className="btn btn-sm btn-outline-secondary me-2">
              <Icon icon="mdi:download" className="me-1" /> Export
            </button> */}
            <button 
              className="btn btn-sm btn-outline-primary"
              onClick={() => fetchPaymentData()}
              disabled={loading}
            >
              <Icon icon="mdi:refresh" className="me-1" /> Refresh
            </button>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default PaymentAnalyticsGraph;