const reviewItems = [
  {
    customerName: 'Alex Johnson',
    customerEmail: 'alex.johnson@email.com',
    customerAvatar: '/images/Reviews/user_1.png',
    orderId: 'ORD00156',
    productName: 'Pepperoni Pizza',
    productImage: '/images/Signature_Non-Veg_Pizzas/Chicken_Pepperoni_Feast.jpg',
    rating: 5,
    text: 'Amazing pizza! Fresh ingredients and super tasty.',
    status: 'Approved',
    featured: true,
    size: 'Large',
    price: 599,
    reply: 'Thank you so much Alex! We are thrilled that you loved the fresh ingredients on our Pepperoni Pizza. Hope to serve you again soon!'
  },
  {
    customerName: 'Emma Watson',
    customerEmail: 'emma.watson@email.com',
    customerAvatar: '/images/Reviews/user_2.png',
    orderId: 'ORD00155',
    productName: 'Cheese Burst Pizza',
    productImage: '/images/Crust/chesse_Burst.jpg',
    rating: 4.5,
    text: 'Cheese burst crust was awesome! Will order again.',
    status: 'Approved',
    featured: true,
    size: 'Medium',
    price: 499,
    reply: ''
  },
  {
    customerName: 'Michael Brown',
    customerEmail: 'michael.brown@email.com',
    customerAvatar: '/images/Reviews/user_3.png',
    orderId: 'ORD00154',
    productName: 'Veg Extravaganza',
    productImage: '/images/Signature_Veg_Pizzas/Veg_Extravaganza.jpg',
    rating: 3,
    text: 'Good pizza but delivery was a bit late.',
    status: 'Pending',
    featured: false,
    size: 'Large',
    price: 549,
    reply: ''
  },
  {
    customerName: 'Sophia Davis',
    customerEmail: 'sophia.davis@email.com',
    customerAvatar: '/images/Reviews/user_4.png',
    orderId: 'ORD00153',
    productName: 'Farmhouse Supreme',
    productImage: '/images/Signature_Veg_Pizzas/Farmhouse_Supreme.jpg',
    rating: 5,
    text: 'Best pizza in town! Highly recommended.',
    status: 'Approved',
    featured: false,
    size: 'Medium',
    price: 449,
    reply: 'We are incredibly happy to hear that Sophia! Thank you for choosing SliceSprint!'
  },
  {
    customerName: 'Daniel Taylor',
    customerEmail: 'daniel.taylor@email.com',
    customerAvatar: '/images/Reviews/user_5.png',
    orderId: 'ORD00152',
    productName: 'Pepper Barbecue Chicken',
    productImage: '/images/Signature_Non-Veg_Pizzas/Pepper_Barbecue_Chicken.jpg',
    rating: 3,
    text: 'It was ok, could be better.',
    status: 'Pending',
    featured: false,
    size: 'Small',
    price: 299,
    reply: ''
  }
];

module.exports = reviewItems;
