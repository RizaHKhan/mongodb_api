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

## Facets

Per MongoDB docs: ** Processes multiple aggregation pipelines with a single stage on the same set of input documents. Each sub-pipeline has its own field in the output document where its results are stored as an array of **

Syntax:

```javascript
db.collection.aggregate([
  {
    $facet: {
      categoryByA: [
        {
          /* Do something */
        },
      ],
      categoryByB: [
        {
          /* Do something */
        },
      ],
    },
  },
]);
```
