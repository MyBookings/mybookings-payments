
export default function Index(props) {
  console.log(props);
  return (
    <h1>Welcome to Payments!</h1>
  );
}

export async function getServerSideProps(ctx) {
  return {
    props: {
      query: ctx.query,
    }
  };
}