
export default function Order(props) {
  console.log(props);
  return (
    <h1>Order page</h1>
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