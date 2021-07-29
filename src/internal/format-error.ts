import { formatPath, PathArray } from "../path";

/** @internal */
export const _formatError = (
    message: string,
    path: PathArray | undefined
): string => !path?.length ? message : `${formatPath(path)}: ${message}`;
