import './summary.css';

interface ISummaryProps {
  count: number;
  total: number;
}

const Summary = (props: ISummaryProps) => {
  const { count, total } = props;
  return (
    <section className='summary'>
      <span>Products: {count}</span>
      <span>Total: {total}</span>
      <button
        className='summary__btn'
        onClick={() => {
          console.log('TODO');
        }}
      >
        Buy Now
      </button>
    </section>
  );
};

export default Summary;
