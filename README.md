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

Commonly used with `facets`.

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

## Redact

A security layer preventing certain information from being sent.

Must resolve to one of three values:

```javascript
$$DESCEND; // retain this level
$$PRUNE;
$$KEEP;
```

Keep in mind:
`$$KEEP` and `$$PRUNE` automatically apply to all levels below the evaluated level.
`$$DESCEND` retains the current level and evaluates the next level down.
`$redact` is not for restricting access to a collection.

## Out Stage

Must be the last stage in a pipeline.

!!

## Aggregation Performance

1. Realtime processing
   Performance is important for realtime processing.
2. Batch processing
   Performance is not important. Used for analytics

### Index usage

Aggregation queries use pipelines and some of the stages can use indexes.

### Memory Constraints

16MB document limit (which doesn't apply as the document flows through the pipeline)

Use `$limit` and `$project` to reduce the size of your results
Use indexes to reduce RAM usage.

If you are still hitting the RAM limit, use the option `allowDiskUse: true` but that should be a last resort as it reduces the performance significantly (this also doesn't work with `$graphLookup`).


