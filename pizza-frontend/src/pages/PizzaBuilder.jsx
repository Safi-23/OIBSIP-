import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const BASES   = ['Thin Crust', 'Thick Crust', 'Cheese Burst'];
const SAUCES  = ['Tomato', 'White Sauce', 'BBQ'];
const CHEESES = ['Mozzarella', 'Cheddar', 'Vegan Cheese', 'Double Cheese'];
const VEGGIES = ['Onion', 'Capsicum', 'Mushroom', 'Olives', 'Corn', 'Jalapeños', 'Tomato'];

function PizzaBuilder() {
  const [step, setStep]   = useState(1);
  const [pizza, setPizza] = useState({
    base: '', sauce: '', cheese: '', veggies: []
  });

  const navigate              = useNavigate();

  const pick = (field, value) => {
    setPizza({ ...pizza, [field]: value });
  };

  const toggleVeggie = (veggie) => {
    const already = pizza.veggies.includes(veggie);
    setPizza({
      ...pizza,
      veggies: already
        ? pizza.veggies.filter(v => v !== veggie)  
        : [...pizza.veggies, veggie]                 
    });
  };

  const goToCheckout = () => {
  navigate('/checkout', { state: { pizza } });
};

  const wrap    = { maxWidth: '600px', margin: '40px auto', padding: '0 1rem' };
  const optBtn = (selected) => ({
    padding: '12px 20px',
    margin: '6px',
    borderRadius: '10px',
    cursor: 'pointer',

    border: selected
      ? '2px solid #F97316'
      : '1px solid #57534E',

    background: selected
      ? '#F97316'
      : '#292524',

    color: selected
      ? '#FFFFFF'
      : '#D6D3D1',

    fontWeight: selected ? '600' : '500',

    transition: 'all 0.2s ease'
  });
  const nextBtn = {
  marginTop: '1.5rem',
  padding: '10px 28px',
  background: '#F97316',
  color: '#FFFFFF',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '15px',
  fontWeight: '600'
};

  return (
    <div style={wrap}>
      <h2>🍕 Build Your Pizza</h2>

      <div style={{ display:'flex', gap:'8px', marginBottom:'2rem' }}>
        {['Base','Sauce','Cheese','Veggies','Summary'].map((label, i) => (
          <div key={i} style={{
            flex:1, textAlign:'center', padding:'6px', borderRadius:'6px', fontSize:'12px',
            background:
              step === i + 1
                ? '#F97316'
                : step > i + 1
                ? '#EA580C'
                : '#44403C',

            color:
              step === i + 1 || step > i + 1
                ? '#FFFFFF'
                : '#A8A29E'
          }}>{label}</div>
        ))}
      </div>


      {step === 1 && (
  <div>
    <h3>Choose your Base</h3>
    <p style={{ color:'#78716C' }}>Pick 1 from 3 options</p>

    {BASES.map(b => (
      <button
        key={b}
        style={optBtn(pizza.base === b)}
        onClick={() => pick('base', b)}
      >
        {b}
      </button>
    ))}

    <br />

    <div style={{ marginTop:'1.5rem' }}>
      <button
        onClick={() => navigate('/dashboard')}
        style={{
          ...nextBtn,
          background:'#292524',
          color:'#F97316',
          border:'1px solid #F97316',
          marginRight:'8px'
        }}
      >
        ← Dashboard
      </button>

      <button
        style={nextBtn}
        disabled={!pizza.base}
        onClick={() => setStep(2)}
      >
        Next →
      </button>
    </div>
  </div>
)}

      {step === 2 && (
        <div>
          <h3>Choose your Sauce</h3>
          <p style={{ color:'#78716C' }}>Pick 1 from 3 options</p>
          {SAUCES.map(s => (
            <button key={s} style={optBtn(pizza.sauce === s)} onClick={() => pick('sauce', s)}>
              {s}
            </button>
          ))}
          <br/>
          <button style={{ ...nextBtn, background:'#78716C', marginRight:'8px' }} onClick={() => setStep(1)}>← Back</button>
          <button style={nextBtn} disabled={!pizza.sauce} onClick={() => setStep(3)}>Next →</button>
        </div>
      )}

      {step === 3 && (
        <div>
          <h3>Choose your Cheese</h3>
          <p style={{ color:'#78716C' }}>Pick 1 type</p>
          {CHEESES.map(c => (
            <button key={c} style={optBtn(pizza.cheese === c)} onClick={() => pick('cheese', c)}>
              {c}
            </button>
          ))}
          <br/>
          <button style={{ ...nextBtn, background:'#78716C', marginRight:'8px' }} onClick={() => setStep(2)}>← Back</button>
          <button style={nextBtn} disabled={!pizza.cheese} onClick={() => setStep(4)}>Next →</button>
        </div>
      )}

      {step === 4 && (
        <div>
          <h3>Choose your Veggies</h3>
          <p style={{ color:'#78716C' }}>Pick as many as you like</p>
          {VEGGIES.map(v => (
            <button key={v} style={optBtn(pizza.veggies.includes(v))} onClick={() => toggleVeggie(v)}>
              {pizza.veggies.includes(v) ? '✓ ' : ''}{v}
            </button>
          ))}
          <br/>
          <button style={{ ...nextBtn, background:'#78716C', marginRight:'8px' }} onClick={() => setStep(3)}>← Back</button>
          <button style={nextBtn} onClick={() => setStep(5)}>Next →</button>
        </div>
      )}

      {step === 5 && (
        <div>
          <h3>Your Pizza Summary 🍕</h3>
          <div style={{ background:'#292524', padding:'1rem', borderRadius:'8px', marginBottom:'1rem' }}>
            <p><strong>Base:</strong> {pizza.base}</p>
            <p><strong>Sauce:</strong> {pizza.sauce}</p>
            <p><strong>Cheese:</strong> {pizza.cheese}</p>
            <p><strong>Veggies:</strong> {pizza.veggies.join(', ') || 'None'}</p>
            <hr/>
            <p><strong>Total: Rs. 350</strong></p>
          </div>
          <button style={{ ...nextBtn, background:'#78716C', marginRight:'8px' }} onClick={() => setStep(4)}>← Back</button>
          <button style={nextBtn} onClick={goToCheckout}>Proceed to Pay Rs. 350 →</button>
        </div>
      )}
    </div>
  );
}

export default PizzaBuilder;

