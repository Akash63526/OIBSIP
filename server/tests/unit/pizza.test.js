describe('Pizza Unit Tests', () => {
  it('should have a name and price', () => {
    const pizza = { name: 'Margherita', price: 299 };
    expect(pizza.name).toBe('Margherita');
    expect(pizza.price).toBe(299);
  });
});
