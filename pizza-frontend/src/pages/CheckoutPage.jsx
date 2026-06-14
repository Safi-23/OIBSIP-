import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate, useLocation } from 'react-router-dom';
import API from '../api/axios';

const stripePromise = loadStripe('pk_test_51TgTIh2LbcZjaTc85qNTxwo5XYthdXoR8Gie3rEV9CDFEekAlI0fdwd6chj83mhNyvKO5rQ6RjMa3WWVEiAiQNEn00FqqvBgQb');

function CheckoutForm({ pizza }) {
  const stripe     = useStripe();
  const elements  = useElements();
  const navigate  = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { data } = await API.post('/orders/create-payment-intent', { amount: 350 });

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement)
        }
      });

      if (result.error) {
        setError(result.error.message);
        return;
      }

      await API.post('/orders/place', {
        pizzaData:       { ...pizza, totalPrice: 350 },
        paymentIntentId: result.paymentIntent.id
      });

      navigate('/dashboard');

    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth:'480px', margin:'0 auto' }}>
      <h3>Complete your payment</h3>
      <p style={{ color:'#A8A29E' }}>Total: Rs. 350</p>

      <div
          style={{
            border: '1px solid #44403C',
            borderRadius: '10px',
            padding: '14px',
            marginBottom: '1rem',
            background: '#292524'
          }}
        >
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#FFFFFF',
                  iconColor: '#F97316',
                  fontFamily: 'Arial, sans-serif',
                  '::placeholder': {
                    color: '#A8A29E'
                  }
                },
                invalid: {
                  color: '#EF4444',
                  iconColor: '#EF4444'
                }
              }
            }}
          />
        </div>

      {error && <p style={{ color:'red', fontSize:'13px' }}>{error}</p>}

      <button type="submit" disabled={!stripe || loading}
        style={{ width:'100%', padding:'12px', background:'#F97316', color:'#292524',
          border:'none', borderRadius:'8px', fontSize:'15px', cursor:'pointer' }}>
        {loading ? 'Processing...' : 'Pay Rs. 350 🍕'}
      </button>
    </form>
  );
}

   function CheckoutPage() {
  const location = useLocation();
  const pizza    = location.state?.pizza || {};

  return (
    <div
          style={{
            maxWidth: '500px',
            margin: '60px auto',
            padding: '2rem',
            background: '#1C1917',
            borderRadius: '16px',
            border: '1px solid #44403C',
            color: '#F5F5F4'
          }}
        >
      <Elements stripe={stripePromise}>
        <CheckoutForm pizza={pizza} />
      </Elements>
    </div>
  );
}

export default CheckoutPage;
