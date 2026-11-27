import type { SVGProps } from "react";

/** Trazados vectoriales oficiales del logotipo de Crescit (sin dependencia de fuentes). */
export const STAR_PATH =
  "M 393 170 C 350 300 328 344 510 374 C 338 411 317 442 247 551 C 292 415 278 402 75 408 C 270 363 287 345 393 170 Z M 327 353 L 396 375 L 357 390 L 370 413 L 351 425 L 336 403 L 305 427 Z";

const WORD_PATH =
  "M 789 272 H 648 C 604 272 575 301 575 341 V 412 C 575 452 604 483 648 483 H 789 V 428 H 655 C 643 428 636 420 636 408 V 347 C 636 335 643 326 655 326 H 789 Z M 814 272 H 986 C 1028 272 1048 295 1048 333 V 350 C 1048 385 1031 406 985 412 L 1048 483 H 968 L 875 390 V 483 H 814 Z M 875 326 V 367 H 963 C 979 367 986 360 986 346 V 343 C 986 331 979 326 963 326 Z M 1073 272 H 1287 V 326 H 1133 V 352 H 1272 V 400 H 1133 V 429 H 1287 V 483 H 1073 Z M 1531 272 H 1368 C 1327 272 1303 300 1303 336 V 340 C 1303 378 1326 402 1365 402 H 1450 C 1464 402 1470 409 1470 416 C 1470 424 1464 429 1451 429 H 1303 V 483 H 1467 C 1507 483 1532 456 1532 419 V 409 C 1532 373 1509 350 1470 350 H 1385 C 1371 350 1363 345 1363 338 C 1363 330 1371 326 1385 326 H 1531 Z M 1767 272 H 1622 C 1578 272 1549 301 1549 341 V 412 C 1549 452 1578 483 1622 483 H 1767 V 428 H 1629 C 1617 428 1610 420 1610 408 V 347 C 1610 335 1617 326 1629 326 H 1767 Z M 1791 272 H 1853 V 483 H 1791 Z M 1876 272 H 2179 L 2141 326 H 2058 V 483 H 1996 V 326 H 1876 Z";

type LogoProps = SVGProps<SVGSVGElement> & { starColor?: string; wordColor?: string; title?: string };

export function Logo({ starColor = "currentColor", wordColor = "currentColor", title = "Crescit", ...rest }: LogoProps) {
  return (
    <svg viewBox="95 97 2104 381" role="img" aria-label={title} {...rest}>
      <g transform="translate(20 -73)">
        <path fill={starColor} fillRule="evenodd" d={STAR_PATH} />
        <path fill={wordColor} fillRule="evenodd" d={WORD_PATH} />
      </g>
    </svg>
  );
}

export function Wordmark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="575 272 1604 211" aria-hidden="true" {...props}>
      <path fill="currentColor" fillRule="evenodd" d={WORD_PATH} />
    </svg>
  );
}

/** La "estrellita": el símbolo con el cursor en su interior. */
export function Star(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="70 165 445 391" aria-hidden="true" {...props}>
      <path fill="currentColor" fillRule="evenodd" d={STAR_PATH} />
    </svg>
  );
}
