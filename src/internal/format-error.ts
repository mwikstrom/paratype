import { formatPath, Path } from "../path";

/** @internal */
export const _formatError = (
    message: string,
    path: Path | undefined
): string => !path?.length ? message : `${formatPath(path)}: ${message}`;
