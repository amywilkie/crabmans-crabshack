# Crabman's Crabshack API

## Endpoints

### GET /menu

#### Resource URL

http://crabmans-crabshack-api.herokuapp.com/api/menu

#### Example Result

```javascript
{
  'Prawn Cocktail': {
    'type': 'starter',
    'description': 'A modern starter for the modern man',
    'price': '3.99'
  },
  'Claw of Crabulon': {
    'type': 'main',
    'description': 'Keep calm and Crabulon',
    'price': '12.85'
  },
  'Crabman Sundae': {
    'type': 'dessert',
    'description': 'Ground up crabs with animal fat ice cream. A variety of sauces available.',
    'price': '4.90'
  },
  'Crabba Cola': {
    'type': 'beverage',
    'description': 'Coca-cola but with our unique distinct crabby flavour',
    'price': '1.80'
  }
}
```

### POST /orders

#### Resource URL

https://crabmans-crabshack-api.herokuapp.com/api/orders

#### Example Request

```javascript
{
  'tableNumber': 1,
  'orderItems': ['Claw of Crabulon', 'Crabba Cola']
}
```

#### Example Response

```javascript
{
  'orderItems': [
    {
      'id': 'Claw of Crabulon',
      'state': 'cooking'
    },
    {
      'id': 'Prawn Sundae',
      'state': 'ordered'
    },
    {
      'id': 'Claw Salad'
      'state': 'deleivered'
    }
  ],
  'total': '23.43'
}
```

### GET /tables/:table-number

#### Resource URL

https://crabmans-crabshack-api.herokuapp.com/api/tables/:table-number

#### Example Response

```javascript
{
  'orderItems': [
    {
      'id': 'Claw of Crabulon',
      'state': 'cooking'
    },
    {
      'id': 'Prawn Sundae',
      'state': 'ordered'
    },
    {
      'id': 'Claw Salad'
      'state': 'deleivered'
    }
  ],
  'total': '23.43'
}
```

### POST /payments

#### Resource URL

https://crabmans-crabshack-api.herokuapp.com/api/payments

#### Example Request

```javascript
{
  'cardNumber': '1234567890',
  'securityCode': '4433',
  'tableNumber': 1
}
```
