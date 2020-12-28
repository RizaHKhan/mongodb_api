# MongoDB API

Praciticing MongoDB queries

## Group

Groups identical documents together

### \$cond

```javascript
// Used in the aggregate framework

{ $cond: { if: <boolean-expression>, then: <true-case>, else: <false-case> } }
// or shorter version:
{ $cond: [ <boolean-expression>, <true-case>, <false-case> ] }

// Use it something like this:
{
  discount: {
    $cond: [ $gte: [ "$qty": 250, 30, 20 ] ]
  }
}
```
