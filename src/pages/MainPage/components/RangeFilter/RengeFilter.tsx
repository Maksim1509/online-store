import { FormEvent, useState } from 'react';
import ReactSlider from 'react-slider';

interface IRangeFilterProps {
  value: number[];
  applyFilterHandler: (min: number, max: number) => void;
}

const RengeFilter = (props: IRangeFilterProps) => {
  const { value: initValue, applyFilterHandler } = props;
  const [min, max] = initValue;
  console.log(initValue);
  const [value, setValue] = useState(initValue);

  const changeHandler = (newValue: number[]) => {
    setValue(newValue);
  };

  const inputHandlerMin = (e: FormEvent) => {
    const target = e.target as HTMLInputElement;
    const newMin = Number(target.value);
    if (isNaN(newMin)) return;
    const [, max] = value;

    setValue([newMin, max]);
  };
  const inputHandlerMax = (e: FormEvent) => {
    const target = e.target as HTMLInputElement;
    const newMax = Number(target.value);
    const [min] = value;
    if (isNaN(newMax)) return;
    setValue([min, newMax]);
  };

  return (
    <section className='range-slider'>
      <ReactSlider
        value={value}
        min={min}
        max={max}
        className='slider'
        trackClassName='tracker'
        step={1}
        withTracks={true}
        renderThumb={(props) => <div {...props} />}
        renderTrack={(props) => <div {...props} />}
        onChange={changeHandler}
      />
      <input
        className='range__input'
        type='text'
        value={value[0]}
        onInput={inputHandlerMin}
      />
      <input
        className='range__input'
        type='text'
        value={value[1]}
        onInput={inputHandlerMax}
      />
      <button
        className='filter__btn'
        onClick={() => applyFilterHandler(value[0], value[1])}
      >
        Apply
      </button>
    </section>
  );
};

export default RengeFilter;
