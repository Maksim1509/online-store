import { ChangeEvent, useState } from 'react';
import { IProduct } from '../../../types';
import './filter.css';

interface IFilterProps {
  products: IProduct[];
  productsData: IProduct[];
  setProducts: React.Dispatch<React.SetStateAction<IProduct[]>>;
}

export enum filterCriterion {
  brand = 'brand',
  category = 'category',
}

export interface IFilterState {
  category: string[];
  brand: string[];
}

interface ICount {
  total: number;
  current: number;
}

export type FilterList = {
  [key: string]: ICount;
};

const filter = (data: IProduct[], state: IFilterState): IProduct[] => {
  const { category, brand } = state;

  if (category.length === 0)
    return data.filter((item) => brand.includes(item.brand));
  if (brand.length === 0)
    return data.filter((item) => category.includes(item.category));
  return data.filter(
    (item): boolean =>
      brand.includes(item.brand) && category.includes(item.category)
  );
};

const getTempFilter = (data: IProduct[], criterion: filterCriterion) =>
  data.reduce<FilterList>((acc, item) => {
    const newCount: number = acc[item[criterion]]
      ? acc[item[criterion]].total + 1
      : 1;
    return { ...acc, [item[criterion]]: { current: 0, total: newCount } };
  }, {});

const updateFilter = (
  data: IProduct[],
  temp: FilterList,
  criterion: filterCriterion
) =>
  data.reduce<FilterList>((acc, item) => {
    const newCount: number = acc[item[criterion]].current + 1;
    return {
      ...acc,
      [item[criterion]]: { ...acc[item[criterion]], current: newCount },
    };
  }, temp);

const Filter = (props: IFilterProps) => {
  const [filterState, setFilterState] = useState<IFilterState>({
    category: [],
    brand: [],
  });
  const { products, productsData, setProducts } = props;

  const tempCategory = getTempFilter(productsData, filterCriterion.category);
  const tempBrand = getTempFilter(productsData, filterCriterion.brand);
  const categoriesFilterList = updateFilter(
    products,
    tempCategory,
    filterCriterion.category
  );
  const brandFilterList = updateFilter(
    products,
    tempBrand,
    filterCriterion.brand
  );

  const changeHandler =
    (name: string, criterion: filterCriterion) => (e: ChangeEvent) => {
      const target = e.target as HTMLInputElement;

      const newState = { ...filterState };
      if (target.checked) {
        newState[criterion].push(name);
        setFilterState(newState);
      } else {
        const filtered = newState[criterion].filter((item) => item !== name);
        newState[criterion] = filtered;
        setFilterState(newState);
      }
      setProducts(filter(productsData, newState));
    };
  console.log(filterState);
  const renderFilterList = (data: FilterList, criterion: filterCriterion) => {
    return Object.entries(data).map(([name, { current, total }], index) => (
      <li className='filter__item' key={index}>
        <label>
          <input
            type='checkbox'
            name=''
            id=''
            onChange={changeHandler(name, criterion)}
          />
          {name}: {`${current} / ${total}`}
        </label>
      </li>
    ));
  };
  return (
    <>
      <section className='filter'>
        <h3>Category</h3>
        <ul className='filter__list'>
          {renderFilterList(categoriesFilterList, filterCriterion.category)}
        </ul>
      </section>
      <section className='filter'>
        <h3>Brand</h3>
        <ul className='filter__list'>
          {renderFilterList(brandFilterList, filterCriterion.brand)}
        </ul>
      </section>
    </>
  );
};

export default Filter;
