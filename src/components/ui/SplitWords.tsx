import { Fragment } from "react";

/**
 * Divide un texto en palabras envueltas en máscaras (.w > .wi) para revelarlas
 * con transform sin medir el DOM: el corte de línea lo sigue haciendo el navegador,
 * así que funciona igual en cualquier ancho.
 */
export function SplitWords({ text, className }: { text: string; className?: string }) {
  const words = text.split(" ");
  return (
    <>
      {words.map((word, i) => (
        <Fragment key={i}>
          <span className={`w ${className ?? ""}`}>
            <span className="wi">{word}</span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </>
  );
}
