"use client";

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "ghost";

function Inner({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
  return (
    <>
      <span className="btn__bg" aria-hidden="true" />
      <span className="roll">
        <span className="roll__a">{children}</span>
        <span className="roll__b" aria-hidden="true">
          {children}
        </span>
      </span>
      {icon}
    </>
  );
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; icon?: ReactNode };

export function Button({ variant = "primary", icon, children, className = "", ...rest }: ButtonProps) {
  return (
    <button className={`btn btn--${variant} ${className}`} {...rest}>
      <Inner icon={icon}>{children}</Inner>
    </button>
  );
}

type LinkButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & { variant?: Variant; icon?: ReactNode };

export function LinkButton({ variant = "primary", icon, children, className = "", ...rest }: LinkButtonProps) {
  return (
    <a className={`btn btn--${variant} ${className}`} {...rest}>
      <Inner icon={icon}>{children}</Inner>
    </a>
  );
}

export function RollText({ children }: { children: ReactNode }) {
  return (
    <span className="roll">
      <span className="roll__a">{children}</span>
      <span className="roll__b" aria-hidden="true">
        {children}
      </span>
    </span>
  );
}

export function ArrowRight({ className = "btn__icon" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M2 8h11M9 3.5 13.5 8 9 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}

export function ArrowDown({ className = "btn__icon" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M8 2v11M3.5 9 8 13.5 12.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}

export function ArrowUpRight({ className = "btn__icon" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M4 12 12 4M5.5 4H12v6.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="square" />
    </svg>
  );
}
