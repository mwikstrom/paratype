<!-- Do not edit this file. It is automatically generated by API Documenter. -->

[Home](./index.md) &gt; [paratype](./paratype.md) &gt; [Type](./paratype.type.md) &gt; [error](./paratype.type.error.md)

## Type.error() method

Returns an error message when the specified value doesn't match the current run-time type, and otherwise `undefined`<!-- -->.

<b>Signature:</b>

```typescript
error(this: void, value: unknown, path?: PathArray, shallow?: boolean): string | undefined;
```

## Parameters

|  Parameter | Type | Description |
|  --- | --- | --- |
|  this | void | <i>(Ignored)</i> This method uses implicit <code>this</code> binding |
|  value | unknown | The value to be checked |
|  path | [PathArray](./paratype.patharray.md) | <i>(Optional)</i> <i>(Optional)</i> Path to the value |
|  shallow | boolean | <i>(Optional)</i> <i>(Optiona)</i> When <code>true</code> errors from array items or record properties are ignored |

<b>Returns:</b>

string \| undefined

