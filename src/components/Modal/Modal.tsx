import { ChangeEvent, useContext, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import './modal.css';
import { useNavigate } from 'react-router-dom';
import { cartContext } from '../../context/CartState';
import { modalContext } from '../../context/ModalState';

interface IFormInputs {
  name: string;
  phone: string;
  adress: string;
  mail: string;
  cardNumber: string;
  cardDate: string;
  cvv: string;
}

const schema = yup.object({
  name: yup
    .string()
    .matches(
      /[a-zA-Z]{3,}\s([a-zA-Z]{3,}){1,}$/,
      'The field must contain at least two words of at least 3 letters'
    ),
  phone: yup
    .string()
    .matches(
      /\+[0-9]{10,}/,
      'Phone number must start with + and be at least 9 digits'
    )
    .max(30),
  adress: yup
    .string()
    .matches(
      /[a-zA-Z]{5,}(\s[a-zA-Z]{5,}){2,}$/,
      'The field must contain at least 3 words of at least 5 letters'
    ),
  mail: yup.string().email().required(),
  cardNumber: yup
    .string()
    .matches(
      /^([0-9]){16}$/,
      'The length of the card number must be 16 characters'
    ),
  cardDate: yup
    .string()
    .matches(/(0[1-9]|1[0-2])\/([0-9]{2})/, 'Wrong card expiration date'),
  cvv: yup.string().required(),
});

const Modal = () => {
  const { updateCart, updateCartSummary } = useContext(cartContext);
  const { hideModal } = useContext(modalContext);
  const navigate = useNavigate();

  const [isLoading, setLoading] = useState(false);
  const [cardDate, setCarDate] = useState('');
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInputs>({
    resolver: yupResolver(schema),
  });

  const onSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      updateCart([]);
      updateCartSummary({ totalCoast: 0, productsCount: 0 });
      hideModal();
      navigate('/');
    }, 3000);
  };

  const cardNumberHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (isNaN(Number(value))) {
      setValue('cardNumber', e.target.value.slice(0, -1).trim());
    } else {
      setValue('cardNumber', e.target.value.slice(0, 16).trim());
    }
  };

  const cvvHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    if (isNaN(Number(value))) {
      setValue('cvv', e.target.value.slice(0, -1).trim());
    } else {
      setValue('cvv', e.target.value.slice(0, 3).trim());
    }
  };

  const dateHandler = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const valueTrimedSlash = target.value.replace(/\//, '');
    const value = target.value.trim();
    if (isNaN(Number(valueTrimedSlash))) return;
    if (value.length === 2 && cardDate.length !== 3) {
      setCarDate(value.slice(0, 2) + '/' + value.slice(3, 5));
    } else {
      setCarDate(value.slice(0, 5).trim());
    }
  };

  register('cardNumber', {
    onChange: cardNumberHandler,
  });
  register('cvv', {
    onChange: cvvHandler,
  });
  register('cardDate', {
    onChange: dateHandler,
  });
  return (
    <>
      <div className='modal__backdrop' onClick={hideModal}></div>
      <div className='modal'>
        <form className='purchase__form' onSubmit={handleSubmit(onSubmit)}>
          Personal details
          <label className='purchase__label'>
            Name Surname
            <input
              {...register('name')}
              className={`purchase__field ${
                errors.name && 'purchase__field_error'
              }`}
              type='text'
              placeholder='Name Surname'
            />
            <p className='form-error'>{errors.name?.message}</p>
          </label>
          <label className='purchase__label'>
            Phone number
            <input
              {...register('phone')}
              className={`purchase__field ${
                errors.phone && 'purchase__field_error'
              }`}
              type='text'
              placeholder='Phone number +999999999'
            />
            <p className='form-error'>{errors.phone?.message}</p>
          </label>
          <label className='purchase__label'>
            Adress
            <input
              {...register('adress')}
              className={`purchase__field ${
                errors.adress && 'purchase__field_error'
              }`}
              type='text'
              placeholder='Adress'
            />
            <p className='form-error'>{errors.adress?.message}</p>
          </label>
          <label className='purchase__label'>
            Email
            <input
              {...register('mail')}
              className={`purchase__field ${
                errors.mail && 'purchase__field_error'
              }`}
              type='email'
              name='mail'
              placeholder='Email'
            />
            <p className='form-error'>{errors.mail?.message}</p>
          </label>
          <section className='card'>
            Card
            <input
              {...register('cardNumber')}
              className={`card__field ${
                errors.cardNumber && 'purchase__field_error'
              }`}
              type='text'
              placeholder='XXXX XXXX XXXX XXXX'
            />
            <input
              {...register('cardDate')}
              className={`card__field ${
                errors.cardDate && 'purchase__field_error'
              }`}
              type='text'
              placeholder='Date'
              value={cardDate}
            />
            <input
              {...register('cvv')}
              className={`card__field ${errors.cvv && 'purchase__field_error'}`}
              type='text'
              placeholder='CVV'
            />
            <ul className='card-errors'>
              <li className='card-error'>{errors.cardNumber?.message}</li>
              <li className='card-error'>{errors.cardDate?.message}</li>
              <li className='card-error'>{errors.cvv?.message}</li>
            </ul>
          </section>
          {isLoading && (
            <p className='form-loading'>
              Thanks for your order, in a few seconds you will be redirected to
              the main page
            </p>
          )}
          <button className='purchase__field purchase__sumbit' type='submit'>
            Confirm
          </button>
        </form>
      </div>
    </>
  );
};

export default Modal;
