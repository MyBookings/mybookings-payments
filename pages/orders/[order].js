import axios from 'axios';
import { useState, useEffect } from 'react';

export default function Order(props) {
  const [status, setStatus] = useState('');

  async function getOrder() {
    try {
      const { data } = await axios.post('/api/get-order', {
        orderId: props.params.order,
      });
      if (data?.status) setStatus(data.status);

    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getOrder();
  }, []);

  return (
    <div>
      <h1>Order page</h1>
      <button onClick={getOrder}>
        Get order
      </button>
      {status && <h2>Status: {status}</h2>}
    </div>
  );
}

export async function getServerSideProps(ctx) {
  return {
    props: {
      query: ctx.query, 
      params: ctx.params,
    }
  };
}