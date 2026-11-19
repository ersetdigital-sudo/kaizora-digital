"use client";

import React, { useEffect, useRef } from "react";
import { Icon } from "./Icon";

const FOCUSABLE =
  'a[href],button:not([disabled]),input:not([disabled]):not([type=hidden]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';

let modalCount = 0;

export default function Modal({
  id,
  title,
  onClose,
  size = "sm",
  children,
  footer,
  footClassName,
  footId,
  lockClose = false,
  labeledBy,
}: {
  id: string;
  title?: React.ReactNode;
  onClose: () => void;
  size?: "sm" | "lg";
  children: React.ReactNode;
  footer?: React.ReactNode;
  footClassName?: string;
  footId?: string;
  lockClose?: boolean;
  labeledBy?: string;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    returnFocusRef.current = document.activeElement as HTMLElement | null;
    const sbw = window.innerWidth - document.documentElement.clientWidth;
    document.documentElement.style.setProperty("--sbw", `${sbw}px`);
    modalCount += 1;
    document.documentElement.classList.add("no-scroll");

    const t = window.setTimeout(() => {
      const dlg = dialogRef.current;
      if (!dlg) return;
      const coarse = window.matchMedia("(pointer: coarse)").matches;
      const first = coarse
        ? null
        : (dlg.querySelector(
            ".modal__body input:not([type=radio]), .modal__body select",
          ) as HTMLElement | null);
      (first ?? dlg).focus({ preventScroll: true });
    }, 30);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lockClose) return;
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;
      const dlg = dialogRef.current;
      if (!dlg) return;
      const items = [...dlg.querySelectorAll<HTMLElement>(FOCUSABLE)].filter(
        (el) => el.offsetParent !== null || el.getClientRects().length > 0,
      );
      if (!items.length) {
        e.preventDefault();
        return;
      }
      const first = items[0]!;
      const last = items[items.length - 1]!;
      if (e.shiftKey && (document.activeElement === first || document.activeElement === dlg)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);

    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      modalCount = Math.max(0, modalCount - 1);
      if (modalCount === 0) document.documentElement.classList.remove("no-scroll");
      if (returnFocusRef.current && document.contains(returnFocusRef.current)) {
        returnFocusRef.current.focus({ preventScroll: true });
      }
    };
  }, [onClose, lockClose]);

  return (
    <div
      className="modal is-mounted is-open"
      id={id}
      role="dialog"
      aria-modal="true"
      aria-labelledby={labeledBy ?? `${id}-title`}
    >
      <div className="modal__backdrop" onClick={() => { if (!lockClose) onClose(); }} />
      <div
        className={`modal__dialog modal__dialog--${size}`}
        tabIndex={-1}
        ref={dialogRef}
        role="document"
      >
        {title !== undefined && (
          <div className="modal__head" id={`${id}-head`}>
            {title}
            <button className="icon-btn" type="button" onClick={onClose} aria-label="Tutup">
              <Icon name="fa-xmark" />
            </button>
          </div>
        )}
        <div className="modal__body" id={`${id}-body`}>{children}</div>
        {footer ? <div className={footClassName ?? "modal__foot"} id={footId}>{footer}</div> : null}
      </div>
    </div>
  );
}
