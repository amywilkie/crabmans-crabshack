Crabman's Crabshack is a family run seafood and beer shack that has been around for 73 years.  Originally started by James Crabman Esquire II, Crabman's Crabshack has been passed down through the generations to his great great grand daughter, Lucy Landmammal née Crabman.

Lucy, and her husband Imhotep Landmammal, are desparate to bring Crabman's Crabshack into the 21st century. They think the way to do this is by allowing their customers to order from an interactive menu at each table, inspired by their wedding reception that was held at The Sandy Crotch in Waterloo.

The Barnacle team from The Bikini Bottom Consultancy have provided an API to allow the interactive menu console to become a reality.

The Open Source API is not the Barnacle Team's best work to date but it is functional. However, they are open to Pull Requests for enhancements or bug fixes.

Imhotep, the product owner, will be present before and during the development of this interactive menu console. He understands the requirements and priorites, so we can work closely with him to work out which features to build.

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

http://crabmans-crabshack-api.herokuapp.com/api/orders

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

http://crabmans-crabshack-api.herokuapp.com/api/tables/:table-number

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

http://crabmans-crabshack-api.herokuapp.com/api/payments

#### Example Request

```javascript
{
  'cardNumber': '1234567890',
  'securityCode': '4433',
  'tableNumber': 1
}
```
