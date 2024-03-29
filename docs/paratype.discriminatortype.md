<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [paratype](./paratype.md) &gt; [discriminatorType](./paratype.discriminatortype.md)

## discriminatorType() function

Constructs a [Type](./paratype.type.md) that represents a union of other types, each with a common distriminator property.

<b>Signature:</b>

```typescript
export declare function discriminatorType<Key extends string & keyof TypeOf<Union[keyof Union]>, Union extends Record<string, Type>>(key: Key, union: Union): Type<TypeOf<Union[keyof Union]>>;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  key | Key |  |
|  union | Union |  |

<b>Returns:</b>

[Type](./paratype.type.md)<!-- -->&lt;[TypeOf](./paratype.typeof.md)<!-- -->&lt;Union\[keyof Union\]&gt;&gt;

