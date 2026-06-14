import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PizzaBuilder from '../../components/pizza/PizzaBuilder';
import { addToCart } from '../../features/cart/cartSlice';

const PizzaBuilderPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleAddToCart = (config) => {
    dispatch(addToCart({
      pizzaId: 'custom',
      name: 'Custom Pizza',
      price: config.price,
      quantity: 1,
      isCustom: true,
      pizzaConfig: config
    }));
    navigate('/cart');
  };

  return (
    <div className="py-8">
      <PizzaBuilder onAddToCart={handleAddToCart} />
    </div>
  );
};

export default PizzaBuilderPage;
