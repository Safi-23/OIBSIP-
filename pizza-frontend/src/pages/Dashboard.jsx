import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';

function Dashboard() {
  const [orders, setOrders]   = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate              = useNavigate();

  const user = JSON.parse(localStorage.getItem('user') || '{}');

      useEffect(() => {
  const token = localStorage.getItem('token');

  if (!token) {
    navigate('/');
  }
}, [navigate]);

 

    useEffect(() => {
     const fetchOrders = async () => {
    try {
      const { data } = await API.get('/orders/myorders');
      setOrders(data);
    } catch (err) {
      console.log('Failed to fetch orders', err.message);
    } finally {
      setLoading(false);
    }
  };

    fetchOrders();
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

 const statusStyle = (status) => {
  if (status === "Order Received") {
    return {
      background: '#FFF3CD',
      color: '#B26A00'
    };
  }

  if (status === "In Kitchen") {
    return {
      background: '#FFE0B2',
      color: '#E65100'
    };
  }

  if (status === "Sent To Delivery") {
    return {
      background: '#FFD6CC',
      color: '#BF360C'
    };
  }

  return {
    background: '#2D2A2D',
    color: '#FFF'
  };
};

  const statusText = (status) => {
    if (status === "Order Received")   return  "Order Received";
    if (status === "In Kitchen")       return "In Kitchen";
    if (status === "Sent To Delivery") return "Sent To Delivery";
    return status;
  };

  return (

    
    <div style={{ maxWidth:'700px', margin:'40px auto', padding:'0 1rem' }}>

      <div style={{ marginBottom:'2rem' }}>
  <h3>Available Pizzas 🍕</h3>
  <div style={{ display:'flex', gap:'12px', flexWrap:'wrap' }}>
    {['Margherita', 'BBQ Chicken', 'Veggie Supreme', 'Pepperoni'].map(name => (
      <div key={name} style={{
        padding:'12px 18px', background:'#292524',
        borderRadius:'10px', border:'1px solid #44403C', fontSize:'14px'
      }}>
        🍕 {name}
      </div>
    ))}
  </div>
  <button onClick={() => navigate('/build')} style={{
    marginTop:'12px', padding:'8px 20px', background:'#F97316',
    color:'#292524', border:'none', borderRadius:'8px', cursor:'pointer'
  }}>Build your own →</button>
</div>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem' }}>
        <div>
          <h2>Welcome back, {user.name}! 👋</h2>
          <p style={{ color:'#78716C', margin:'0' }}>Here are your orders</p>
        </div>
        <div style={{ display:'flex', gap:'8px' }}>
          <button onClick={() => navigate('/build')}
            style={{ padding:'8px 16px', background:'#F97316', color:'white', border:'none', borderRadius:'8px', cursor:'pointer' }}>
            🍕 New Pizza
          </button>
          <button
                onClick={logout}
                style={{
                  padding:'8px 16px',
                  background:'#7F1D1D',
                  color:'#FEE2E2',
                  border:'none',
                  borderRadius:'8px',
                  cursor:'pointer',
                  fontWeight:'600'
                }}
              >
                Logout
          </button>
        </div>
      </div>

      {loading && <p>Loading orders...</p>}

      {!loading && orders.length === 0 && (
        <div style={{ textAlign:'center', padding:'3rem', background:'#292524', borderRadius:'12px' }}>
          <p style={{ fontSize:'2rem' }}>🍕</p>
          <p>No orders yet!</p>
          <button onClick={() => navigate('/build')}
            style={{ padding:'10px 24px', background:'#F97316', color:'#292524', border:'none', borderRadius:'8px', cursor:'pointer' }}>
            Build your first pizza
          </button>
        </div>
      )}

      {orders.map(order => (
        <div key={order._id} style={{
          border:'1px solid #44403C', borderRadius:'12px',
          padding:'1rem', marginBottom:'1rem'
        }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <strong>Order #{order._id.slice(-6)}</strong>
            <span
            style={{
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '13px',
              fontWeight: '600',
              ...statusStyle(order.status)
            }}
          >
            {statusText(order.status)}
          </span>
          </div>
          <div style={{ marginTop:'8px', color:'#A8A29E', fontSize:'14px' }}>
            <span>🫓 {order.base}</span>  · 
            <span>🍅 {order.sauce}</span>  · 
            <span>🧀 {order.cheese}</span>
            {order.veggies.length > 0 && <span>  ·  🥦 {order.veggies.join(', ')}</span>}
          </div>
          <div style={{ marginTop:'6px', fontSize:'13px', color:'#999' }}>
            Rs. {order.totalPrice}  ·  {new Date(order.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Dashboard;

