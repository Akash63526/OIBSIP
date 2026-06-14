# API Documentation
All routes are prefixed with \`/api\`

## Auth Endpoints
- \`POST /auth/register\` - Register new user
- \`POST /auth/login\` - Login user
- \`POST /auth/logout\` - Logout user
- \`GET /auth/me\` - Get current profile (Protected)

## Pizza Catalog
- \`GET /pizzas\` - Get all pizzas
- \`POST /pizzas\` - Create pizza (Admin)
- \`PUT /pizzas/:id\` - Update pizza (Admin)

## Orders
- \`POST /orders\` - Create order (Protected)
- \`GET /orders/my-orders\` - Get user orders (Protected)
- \`GET /orders\` - Get all orders (Admin)
- \`PATCH /orders/:id/status\` - Update status (Admin)

## Inventory
- \`GET /inventory\` - Get all inventory (Admin)
- \`POST /inventory\` - Add inventory (Admin)
- \`PUT /inventory/:id\` - Update inventory (Admin)

## Analytics
- \`GET /admin/stats\` - Get dashboard statistics (Admin)
- \`GET /admin/users\` - Get user list (Admin)
