<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [paratype](./paratype.md) &gt; [RecordObject](./paratype.recordobject.md) &gt; [unmerge](./paratype.recordobject.unmerge.md)

## RecordObject.unmerge() method

Returns a copy of the current object with the specified properties merged out

<b>Signature:</b>

```typescript
unmerge(props: Partial<Pick<Props, OptionalPropsOf<Props>>>): this;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  props | Partial&lt;Pick&lt;Props, [OptionalPropsOf](./paratype.optionalpropsof.md)<!-- -->&lt;Props&gt;&gt;&gt; | The properties to unmerge |

<b>Returns:</b>

this

## Remarks

Only properties that are supported by the current object and have equal values with the current object are unmerged, other properties are ignored.

If the resulting object would be equal to the current instance, then the current instance is returned instead.

