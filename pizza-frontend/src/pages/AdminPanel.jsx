import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';



function AdminPanel() {
  const [tab, setTab]           = useState('orders');  
  const [orders, setOrders]     = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading]   = useState(true);
  const navigate                = useNavigate();
    useEffect(() => {
  const token = localStorage.getItem('token');

  if (!token) {
    navigate('/');
  }
}, [navigate]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ordersRes, inventoryRes] = await Promise.all([
          API.get('/admin/orders'),
          API.get('/admin/inventory')
        ]);
        setOrders(ordersRes.data);
        setInventory(inventoryRes.data);
      } catch (err) {
        console.log(err.message);
        navigate('/');  
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [navigate]);

  const updateStatus = async (orderId, newStatus) => {
    try {
      await API.put(`/admin/orders/${orderId}`, { status: newStatus });
      setOrders(orders.map(o =>
        o._id === orderId ? { ...o, status: newStatus } : o
      ));
    } catch (err) {
      console.log('Status update failed', err.message);
    }
  };

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
      background: '#44403C',
      color: '#FFF'
    };
  };

  if (loading)
      return (
        <div style={{
          minHeight:'100vh',
          background:'#1C1917',
          color:'#F97316',
          display:'flex',
          justifyContent:'center',
          alignItems:'center',
          fontSize:'20px'
        }}>
          🍕 Loading Admin Panel...
        </div>
    );
  return (
    <div style={{
      maxWidth:'900px',
      margin:'0 auto',
      padding:'2rem 1rem',
      minHeight:'100vh',
      background:'#1C1917',
      color:'#F5F5F4'
    }}>
    
    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
      <h2>🍕 Admin Panel</h2>
      <button onClick={logout}
      style={{ padding:'8px 16px', background:'#DC2626', color:'#FFF', border:'none', borderRadius:'8px', cursor:'pointer' }}>
      Logout
      </button>
    </div>

      
    <div style={{ display:'flex', gap:'8px', marginBottom:'1.5rem' }}>
      {['orders', 'inventory'].map(t => (
        <button key={t} onClick={() => setTab(t)} style={{
          padding:'8px 20px', borderRadius:'8px', cursor:'pointer', border:'none',
          background: tab === t ? '#F97316' : '#44403C',
          color: tab === t ? '#292524' : '#E7E5E4',
          fontWeight: tab === t ? '500' : 'normal', textTransform:'capitalize'
          }}>{t}</button>
      ))}
    </div>

      
      {tab === 'orders' && (
        <div>
          <h3>All Orders ({orders.length})</h3>
          {orders.length === 0 && <p style={{ color:'#78716C' }}>No orders yet</p>}
          {orders.map(order => (
            <div key={order._id} style={{
              background:'#292524', border:'1px solid #57534E', boxShadow:'0 4px 12px rgba(0,0,0,0.25)', borderRadius:'12px',
              padding:'1rem', marginBottom:'1rem'
            }}>
              <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'8px' }}>
                <div>
                  <strong>#{order._id.slice(-6)}</strong>
                  <span style={{ color:'#D6D3D1', fontSize:'13px', marginLeft:'8px' }}>
                    {order.userId?.name} — {order.userId?.email}
                  </span>
                </div>
                <span
                  style={{
                    padding:'4px 12px',
                    borderRadius:'20px',
                    fontSize:'13px',
                    fontWeight:'600',
                    ...statusStyle(order.status)
                  }}
                >
                  {order.status}
              </span>
              </div>
              <div style={{ margin:'8px 0', fontSize:'14px', color:'#A8A29E' }}>
                🫓 {order.base} · 🍅 {order.sauce} · 🧀 {order.cheese}
                {order.veggies.length > 0 && ` · 🥦 ${order.veggies.join(', ')}`}
              </div>
              <div style={{ display:'flex', gap:'8px', flexWrap:'wrap' }}>
                {['Order Received', 'In Kitchen', 'Sent To Delivery'].map(s => (
                  <button key={s} onClick={() => updateStatus(order._id, s)}
                    style={{
                          padding:'5px 12px',
                          borderRadius:'6px',
                          cursor:'pointer',
                          fontSize:'12px',
                          border: order.status === s
                            ? '2px solid #F97316'
                            : '1px solid #57534E',
                          background: order.status === s
                            ? '#F97316'
                            : '#292524',
                          color: order.status === s
                            ? '#1C1917'
                            : '#F5F5F4',
                          fontWeight:'600'
                        }}>
                  {s}</button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

     
      {tab === 'inventory' && <InventoryTab inventory={inventory} setInventory={setInventory} />}
    </div>
  );
}


function InventoryTab({ inventory, setInventory }) {
  const [editing, setEditing] = useState({});  

  const handleChange = (id, value) => {
    setEditing({ ...editing, [id]: value });
  };

  const saveQty = async (id) => {
    try {
      const { data } = await API.put(`/admin/inventory/${id}`, {
        quantity: Number(editing[id])
      });
      setInventory(inventory.map(i => i._id === id ? data : i));
      const newEditing = { ...editing };
      delete newEditing[id];
      setEditing(newEditing);
    } catch (err) {
      console.log('Update failed', err.message);
    }
  };

  const categories = ['base', 'sauce', 'cheese', 'veggie'];

  return (
    <div>
      <h3>Inventory Management</h3>
      {categories.map(cat => (
        <div key={cat} style={{ marginBottom:'1.5rem' }}>
          <h4 style={{ textTransform:'capitalize', color:'#F97316', marginBottom:'8px' }}>
            {cat}s
          </h4>
          {inventory
            .filter(i => i.category === cat)
            .map(item => {
              const isLow = item.quantity <= item.threshold;
              const currentVal = editing[item._id] !== undefined
                ? editing[item._id] : item.quantity;
              return (
                <div key={item._id} style={{
                  display:'flex', alignItems:'center', gap:'12px',
                  padding:'10px 14px', marginBottom:'6px', borderRadius:'8px',
                  background: isLow ? '#7F1D1D' : '#292524',
                  border: isLow ? '1px solid #DC2626' : '1px solid #57534E'
                }}>
                  <span style={{ flex:1, fontWeight:'500' }}>{item.name}</span>
                  {isLow && <span style={{ color:'#FCA5A5', fontSize:'12px' }}>⚠️ Low stock!</span>}
                  <span style={{ color:'#78716C', fontSize:'13px' }}>
                    threshold: {item.threshold}
                  </span>
                  <input type="number" value={currentVal}
                    onChange={(e) => handleChange(item._id, e.target.value)}
                    style={{
                      width:'70px',
                      padding:'6px 8px',
                      borderRadius:'6px',
                      border:'1px solid #57534E',
                      background:'#1C1917',
                      color:'#FFF'
                    }}                  />
                  <button onClick={() => saveQty(item._id)} style={{
                    padding:'5px 12px', background:'#F97316', color:'#292524',
                    border:'none', borderRadius:'6px', cursor:'pointer', fontSize:'12px'
                  }}>Save</button>
                </div>
              );
            })}
        </div>
      ))}
    </div>
  );
}
export default AdminPanel;

