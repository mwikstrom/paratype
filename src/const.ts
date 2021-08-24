import { _constType } from "./internal/const";
import { Type } from "./type";

/**
 * Constructs a {@link Type} that represents a fixed string value.
 * @public
 **/
export function constType(fixed: string): Type<string> {
    return _constType(fixed, `Must be ${JSON.stringify(fixed)}`);
}
