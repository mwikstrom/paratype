<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [paratype](./paratype.md) &gt; [enumType](./paratype.enumtype.md)

## enumType() function

Constructs a [Type](./paratype.type.md) that represents an enumeration of the specified values.

<b>Signature:</b>

```typescript
export declare function enumType<V extends string>(values: readonly V[]): Type<V>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  values | readonly V\[\] | Allowed values of the new enum type |

<b>Returns:</b>

[Type](./paratype.type.md)<!-- -->&lt;V&gt;

