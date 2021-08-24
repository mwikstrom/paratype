import { _constType } from "./internal/const";
import { Type } from "./type";

/**
 * Constructs a {@link Type} that represents a fixed string value.
 * @public
 **/
export function constType<T extends string>(fixed: T): Type<T> {
    return _constType(fixed, `Must be ${JSON.stringify(fixed)}`);
}
