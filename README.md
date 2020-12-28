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

The results come back in an array of document/documents.

## Buckets

Per MongoDB:

> Categories incoming documents into groups, called buckets, based on a specified expressions and bucket boundaries and ouputs a document per each bucket. Each output document contains an `_id` field whose value specifies the inclusive lower bound of the bucket. The output option specifies the fields included in each output document.
>
> `$bucket` only produces output documents for buckets that contain at least one input document.

Syntax:

```javascript
{
  $bucket: {
    groupBy: <expression>,
    boundaries: [<lowerbound1>, <lowerbound2>,...],
    default: <literal>,
    output: {
      <output1>: {<$accumulator expression>},
      ...
      <output2>: {<$accumulator expression>},
    }
  }
}
```
