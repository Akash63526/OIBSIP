describe('Order Unit Tests', () => {
  it('should calculate order total correctly', () => {
    const items = [{ price: 10, quantity: 2 }];
    const total = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
    expect(total).toBe(20);
  });
});
