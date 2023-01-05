import { ChangeEvent, useState } from 'react';
import './summary.css';

interface ISummaryProps {
  count: number;
  total: number;
}

interface Code {
  code: string;
  value: number;
  id: number;
}

const codesData: Code[] = [
  { code: 'RS', value: 10, id: 1 },
  { code: 'EPM', value: 10, id: 2 },
];

type ApllyCodesState = {
  [id: number]: Code;
};
const invalidCodeMessage = 'This is the wrong promo code';

const Summary = (props: ISummaryProps) => {
  const { count, total } = props;
  const [inputCodeValue, setInputCodeValue] = useState('');
  const [applyCodes, setApplyCodes] = useState<ApllyCodesState>({});
  const [invalidCode, setInvalidCode] = useState('');
  const [totalDiscont, setTotalDiscont] = useState(0);

  const findCode = (value: string): Code | null => {
    const code = codesData.find((item) => item.code === value.toUpperCase());
    if (code) return code;
    return null;
  };
  const inputCodeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { target } = e;
    setInputCodeValue(target.value);
    setInvalidCode('');
  };
  const apllyCodeHandler = () => {
    const code = findCode(inputCodeValue);
    if (code) {
      const { value } = code;
      if (!applyCodes[code.id]) {
        setTotalDiscont(value + totalDiscont);
      }
      setApplyCodes({ ...applyCodes, [code.id]: code });
      setInputCodeValue('');
    } else {
      setInvalidCode(invalidCodeMessage);
    }
  };
  const dropCodeHandler = (idForDrop: number) => () => {
    const copyApplyCodes = { ...applyCodes };
    delete copyApplyCodes[idForDrop];
    setTotalDiscont(totalDiscont - applyCodes[idForDrop].value);
    setApplyCodes(copyApplyCodes);
  };

  const renderAddedCodes = () => {
    return (
      <ul>
        {Object.values(applyCodes).map(({ code, value, id }) => (
          <li key={id}>
            {code}: -{value}%<button onClick={dropCodeHandler(id)}>Drop</button>
          </li>
        ))}
      </ul>
    );
  };

  return (
    <section className='summary'>
      <span>Products: {count}</span>
      <span
        className={
          totalDiscont
            ? 'summary__total summary__total_line-through'
            : 'summary__total'
        }
      >
        Total: {total}
      </span>
      {!!totalDiscont && (
        <span>Total: {Math.round((total / 100) * (100 - totalDiscont))}</span>
      )}
      <div className='summary__promo-wrap'>
        <input
          onChange={inputCodeHandler}
          className='summary__promo'
          type='text'
          placeholder='Enter promo code'
          value={inputCodeValue}
        />
        {!!invalidCode && (
          <span className='summary__invalid-code'>{invalidCode}</span>
        )}
      </div>

      <button className='promo__btn' onClick={apllyCodeHandler}>
        apply propmo code
      </button>
      <span className='summary__test-codes'>Test Codes: rs, epm</span>
      {renderAddedCodes()}
      <button
        className='summary__btn'
        onClick={() => {
          console.log('TODO');
        }}
      >
        Buy Now
      </button>
      <span className='summary__test-codes'>Test Codes: rs, epm</span>
    </section>
  );
};

export default Summary;
