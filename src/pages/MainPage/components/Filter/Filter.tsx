import { ChangeEvent, useState } from 'react';
import { IProduct } from '../../../../types';
import RengeFilter from '../RangeFilter/RengeFilter';
import './filter.css';

export interface IFilterProps {
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
  price: [number, number];
  stock: [number, number];
}

interface ICount {
  total: number;
  current: number;
}

export type FilterList = {
  [key: string]: ICount;
};

export const getBounds = (
  data: IProduct[],
  type: 'price' | 'stock'
): [number, number] => {
  const sorted = data.slice().sort((itemA, itemB) => itemA[type] - itemB[type]);
  const lastIndex = data.length - 1;
  return [sorted[0][type], sorted[lastIndex][type]];
};

const filter = (data: IProduct[], state: IFilterState): IProduct[] => {
  const {
    category,
    brand,
    price: [minPrice, maxPrice],
    stock: [minStock, maxStock],
  } = state;
  const filteredByStock = data.filter(
    (item) => item.stock >= minStock && item.stock <= maxStock
  );
  const filteredByPrice = filteredByStock.filter(
    (item) => item.price >= minPrice && item.stock <= maxPrice
  );
  if (category.length === 0)
    return filteredByPrice.filter((item) => brand.includes(item.brand));
  if (brand.length === 0)
    return filteredByPrice.filter((item) => category.includes(item.category));
  return filteredByPrice.filter(
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
  const { products, productsData, setProducts } = props;
  const [minPrice, maxPrice] = getBounds(productsData, 'price');
  const [minStock, maxStock] = getBounds(productsData, 'stock');

  const [filterState, setFilterState] = useState<IFilterState>({
    category: [],
    brand: [],
    price: [minPrice, maxPrice],
    stock: [minStock, maxStock],
  });

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

  const applyFilterPriceHandler = (min: number, max: number) => {
    const filtered = products.filter(
      (item) => item.price >= min && item.price <= max
    );
    const stockBounds = getBounds(filtered, 'stock');
    setFilterState({ ...filterState, stock: stockBounds, price: [min, max] });
    setProducts(filtered);
  };

  const applyFilterStockHandler = (min: number, max: number) => {
    const filtered = products.filter(
      (item) => item.stock >= min && item.stock <= max
    );
    const priceBounds = getBounds(filtered, 'price');
    setFilterState({ ...filterState, price: priceBounds, stock: [min, max] });
    setProducts(filtered);
  };

  const resetFilterHandler = () => {
    setFilterState({
      category: [],
      brand: [],
      price: [minPrice, maxPrice],
      stock: [minStock, maxStock],
    });
    setProducts(productsData);
  };

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
          {name}: {`[${current} / ${total}]`}
        </label>
      </li>
    ));
  };
  console.log(filterState);
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
      <section className='filter'>
        <h4>Price</h4>
        <RengeFilter
          value={filterState.price}
          applyFilterHandler={applyFilterPriceHandler}
        />
        <h4>Stock</h4>
        <RengeFilter
          value={filterState.stock}
          applyFilterHandler={applyFilterStockHandler}
        />
        <button className='filter__btn' onClick={resetFilterHandler}>
          Reset Filter
        </button>
      </section>
    </>
  );
};

export default Filter;
