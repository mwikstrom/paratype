<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [paratype](./paratype.md) &gt; [Type](./paratype.type.md) &gt; [test](./paratype.type.test.md)

## Type.test() method

Determines whether the specified value matches the current run-time type.

<b>Signature:</b>

```typescript
test(this: void, value: unknown, path?: PathArray): value is T;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  this | void | <i>(Ignored)</i> This method uses implicit <code>this</code> binding |
|  value | unknown | The value to be checked |
|  path | [PathArray](./paratype.patharray.md) | <i>(Optional)</i> <i>(Optional)</i> Path to the value |

<b>Returns:</b>

value is T

`true` if the value matches; otherwise, `false`

