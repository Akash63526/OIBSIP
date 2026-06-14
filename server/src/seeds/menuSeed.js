const menuItems = [
    // VEG PIZZAS
    {
        name: "Margherita Classic",
        category: "veg-pizza",
        subCategory: "classic",
        description: "Fresh mozzarella cheese, tomato sauce, basil leaves",
        image: "/images/Signature_Veg_Pizzas/Margherita_Classic.jpg",
        basePrice: 199,
        isVeg: true,
        isFeatured: true,
        sizes: [
            { name: "small", price: 199 },
            { name: "medium", price: 299 },
            { name: "large", price: 399 },
        ],
    },

    {
        name: "Farmhouse Supreme",
        category: "veg-pizza",
        subCategory: "premium",
        description: "Onion, capsicum, mushroom, tomato, mozzarella",
        image: "/images/Signature_Veg_Pizzas/Farmhouse_Supreme.jpg",
        basePrice: 299,
        isVeg: true,
        isBestSeller: true,
        sizes: [
            { name: "small", price: 299 },
            { name: "medium", price: 399 },
            { name: "large", price: 499 },
        ],
    },

    {
        name: "Cheese n Corn Delight",
        category: "veg-pizza",
        subCategory: "classic",
        description: "Sweet corn, extra cheese, creamy mozzarella",
        image: "/images/Signature_Veg_Pizzas/Cheese_n_Corn_Delight.jpg",
        basePrice: 249,
        isVeg: true,
    },

    {
        name: "Peppy Paneer",
        category: "veg-pizza",
        subCategory: "premium",
        description: "Paneer cubes, capsicum, red paprika, cheese",
        image: "/images/Signature_Veg_Pizzas/Peppy_Paneer.jpg",
        basePrice: 329,
        isVeg: true,
        isFeatured: true,
    },

    {
        name: "Veg Extravaganza",
        category: "veg-pizza",
        subCategory: "premium",
        description: "Onion, capsicum, mushroom, corn, jalapeno, olives",
        image: "/images/Signature_Veg_Pizzas/Veg_Extravaganza.jpg",
        basePrice: 399,
        isVeg: true,
    },

    {
        name: "Mexican Green Wave",
        category: "veg-pizza",
        subCategory: "premium",
        description: "Jalapeno, onion, capsicum, herbs, cheese",
        image: "/images/Signature_Veg_Pizzas/Mexican_Green_Wave.jpg",
        basePrice: 349,
        isVeg: true,
    },

    {
        name: "Spicy Veggie Blast",
        category: "veg-pizza",
        subCategory: "spicy",
        description: "Mixed veggies with spicy schezwan drizzle",
        image: "/images/Signature_Veg_Pizzas/Spicy_Veggie_Blast_Pizza.jpg",
        basePrice: 369,
        isVeg: true,
    },

    {
        name: "Tandoori Paneer Special",
        category: "veg-pizza",
        subCategory: "indian",
        description: "Tandoori paneer, onion, capsicum, cheese",
        image: "/images/Signature_Veg_Pizzas/Tandoori_Paneer.jpg",
        basePrice: 389,
        isVeg: true,
    },

    // NON VEG PIZZAS
    {
        name: "Pepper Barbecue Chicken",
        category: "nonveg-pizza",
        subCategory: "bbq",
        description: "BBQ chicken chunks, onion, mozzarella",
        image: "/images/Signature_Non-Veg_Pizzas/Pepper_Barbecue_Chicken.jpg",
        basePrice: 399,
        isVeg: false,
        isBestSeller: true,
    },

    {
        name: "Chicken Dominator",
        category: "nonveg-pizza",
        subCategory: "premium",
        description: "Chicken sausage, pepperoni, grilled chicken",
        image: "/images/Signature_Non-Veg_Pizzas/Chicken_Dominator.jpg",
        basePrice: 499,
        isVeg: false,
    },

    {
        name: "Chicken Pepperoni Feast",
        category: "nonveg-pizza",
        subCategory: "premium",
        description: "Double pepperoni with cheese overload",
        image: "/images/Signature_Non-Veg_Pizzas/Chicken_Pepperoni_Feast.jpg",
        basePrice: 449,
        isVeg: false,
    },

    {
        name: "Keema Do Pyaza",
        category: "nonveg-pizza",
        subCategory: "indian",
        description: "Chicken keema, onion, herbs, cheese",
        image: "/images/Signature_Non-Veg_Pizzas/Keema_Do_Pyaza.jpg",
        basePrice: 429,
        isVeg: false,
    },

    {
        name: "BBQ Chicken Supreme",
        category: "nonveg-pizza",
        subCategory: "bbq",
        description: "Chicken chunks, bbq sauce, onion, capsicum",
        image: "/images/Signature_Non-Veg_Pizzas/BBQ_Chicken_Supreme.jpg",
        basePrice: 459,
        isVeg: false,
    },

    {
        name: "Meat Lovers Special",
        category: "nonveg-pizza",
        subCategory: "premium",
        description: "Chicken sausage, bacon, pepperoni",
        image: "/images/Signature_Non-Veg_Pizzas/Meat_Lovers_Special.jpg",
        basePrice: 549,
        isVeg: false,
        isFeatured: true,
    },

    // SIDES
    {
        name: "Garlic Breadsticks",
        category: "sides",
        description: "Crispy garlic bread with seasoning",
        image: "/images/Garlic_Breads_and_Sides/Garlic_Breadsticks.jpg",
        basePrice: 129,
        isVeg: true,
    },

    {
        name: "Stuffed Garlic Bread",
        category: "sides",
        description: "Cheese-filled garlic bread",
        image: "/images/Garlic_Breads_and_Sides/Stuffed_Garlic_Bread.jpg",
        basePrice: 179,
        isVeg: true,
    },

    {
        name: "Cheese Garlic Bread",
        category: "sides",
        description: "Extra mozzarella garlic bread",
        image: "/images/Garlic_Breads_and_Sides/Cheese_Garlic_Bread.jpg",
        basePrice: 199,
        isVeg: true,
    },

    {
        name: "Chicken Wings",
        category: "sides",
        description: "Spicy crispy chicken wings",
        image: "/images/Garlic_Breads_and_Sides/Chicken_Wings.jpg",
        basePrice: 249,
        isVeg: false,
    },

    {
        name: "Chicken Nuggets",
        category: "sides",
        description: "Crunchy chicken nuggets",
        image: "/images/Garlic_Breads_and_Sides/Chicken_Nuggets.jpg",
        basePrice: 199,
        isVeg: false,
    },

    {
        name: "Veg Nuggets",
        category: "sides",
        description: "Crispy veg bites",
        image: "/images/Garlic_Breads_and_Sides/Veg_Nuggets.png",
        basePrice: 149,
        isVeg: true,
    },

    {
        name: "French Fries",
        category: "sides",
        description: "Classic salted fries",
        image: "/images/Garlic_Breads_and_Sides/French_Fries.jpg",
        basePrice: 99,
        isVeg: true,
    },

    {
        name: "Peri Peri Fries",
        category: "sides",
        description: "Spicy peri peri fries",
        image: "/images/Garlic_Breads_and_Sides/Peri_Peri_Fries.jpg",
        basePrice: 129,
        isVeg: true,
    },

    {
        name: "Potato Wedges",
        category: "sides",
        description: "Crispy seasoned wedges",
        image: "/images/Garlic_Breads_and_Sides/Potato_Wedges.jpg",
        basePrice: 149,
        isVeg: true,
    },

    // PASTA
    {
        name: "White Sauce Pasta",
        category: "pasta",
        description: "Creamy cheesy pasta",
        image: "/images/Pasta_and_Meltz/White_sauce_pasta.jpg",
        basePrice: 199,
        isVeg: true,
    },

    {
        name: "Red Sauce Pasta",
        category: "pasta",
        description: "Tangy tomato pasta",
        image: "/images/Pasta_and_Meltz/Red-Sauce-Pasta.jpg",
        basePrice: 189,
        isVeg: true,
    },

    {
        name: "Alfredo Chicken Pasta",
        category: "pasta",
        description: "Creamy chicken pasta",
        image: "/images/Pasta_and_Meltz/Alfredo_Chicken_Pasta.jpg",
        basePrice: 249,
        isVeg: false,
    },

    {
        name: "Veg Taco Meltz",
        category: "pasta",
        description: "Loaded cheesy taco wrap",
        image: "/images/Pasta_and_Meltz/Veg_Taco_Meltz.jpg",
        basePrice: 179,
        isVeg: true,
    },

    {
        name: "Chicken Taco Meltz",
        category: "pasta",
        description: "Chicken stuffed taco melt",
        image: "/images/Pasta_and_Meltz/Chicken_Taco_Meltz.jpg",
        basePrice: 229,
        isVeg: false,
    },

    // DESSERTS
    {
        name: "Choco Lava Cake",
        category: "desserts",
        description: "Warm molten chocolate cake",
        image: "/images/Desserts/Choco_Lava_Cake.jpg",
        basePrice: 109,
        isVeg: true,
    },

    {
        name: "Brownie Blast",
        category: "desserts",
        description: "Chocolate brownie with fudge",
        image: "/images/Desserts/Brownie_Blast.jpg",
        basePrice: 129,
        isVeg: true,
    },

    {
        name: "Chocolate Mousse",
        category: "desserts",
        description: "Rich chocolate mousse",
        image: "/images/Desserts/Chocolate_Mousse.jpg",
        basePrice: 149,
        isVeg: true,
    },

    {
        name: "Cheesecake Slice",
        category: "desserts",
        description: "Creamy cheesecake dessert",
        image: "/images/Desserts/Cheesecake_Slice.jpg",
        basePrice: 179,
        isVeg: true,
    },

    // BEVERAGES
    {
        name: "Coca-Cola",
        category: "beverages",
        description: "Refreshing soft drink",
        image: "/images/Beverages/Coco_cola.jpg",
        basePrice: 60,
        beverageSize: "500ml",
        isVeg: true,
    },

    {
        name: "Pepsi",
        category: "beverages",
        description: "Cold refreshing drink",
        image: "/images/Beverages/Pepsi.jpg",
        basePrice: 60,
        beverageSize: "500ml",
        isVeg: true,
    },

    {
        name: "Sprite",
        category: "beverages",
        description: "Lemon lime cold drink",
        image: "/images/Beverages/Sprite.jpg",
        basePrice: 60,
        beverageSize: "500ml",
        isVeg: true,
    },

    {
        name: "Fanta",
        category: "beverages",
        description: "Orange flavored soft drink",
        image: "/images/Beverages/Fanta.jpg",
        basePrice: 60,
        beverageSize: "500ml",
        isVeg: true,
    },

    {
        name: "Iced Tea",
        category: "beverages",
        description: "Refreshing chilled iced tea",
        image: "/images/Beverages/Iced_Tea.jpg",
        basePrice: 79,
        beverageSize: "500ml",
        isVeg: true,
    },

    {
        name: "Cold Coffee",
        category: "beverages",
        description: "Creamy chilled coffee",
        image: "/images/Beverages/Cold_Coffee.jpg",
        basePrice: 99,
        beverageSize: "400ml",
        isVeg: true,
    },

    {
        name: "Orange Juice",
        category: "beverages",
        description: "Fresh orange juice",
        image: "/images/Beverages/Orange_Juice.jpg",
        basePrice: 89,
        beverageSize: "300ml",
        isVeg: true,
    },
];

module.exports = menuItems;