'use client';

import React, { ReactNode, useCallback, useEffect, useId, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { cssObj } from './Modal.style';
import { CloseIcon, MovelinkIcon } from '@/common/icons';

export type ModalMenu = {
  id: string;
  label: string;
  content: ReactNode;
};

export type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  menus: ModalMenu[];
  initialMenuId?: string;
  className?: string;
};

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  menus,
  initialMenuId,
  className,
}) => {
  const [activeMenuId, setActiveMenuId] = useState<string | undefined>(initialMenuId);

  const titleId = useId();

  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  const effectiveActiveMenuId = useMemo(() => {
    if (!menus.length) return undefined;

    if (activeMenuId && menus.some((m) => m.id === activeMenuId)) {
      return activeMenuId;
    }
    return (
      (initialMenuId && menus.some((m) => m.id === initialMenuId) && initialMenuId) || menus[0].id
    );
  }, [activeMenuId, initialMenuId, menus]);

  const activeMenu = useMemo(() => {
    if (!menus.length) return undefined;
    return menus.find((m) => m.id === effectiveActiveMenuId) ?? menus[0];
  }, [menus, effectiveActiveMenuId]);

  const handleSelectMenu = useCallback((menuId: string) => {
    setActiveMenuId(menuId);
  }, []);

  if (!isOpen || typeof document === 'undefined') {
    return null;
  }

  const modalContent = (
    <div css={cssObj.overlay} role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        css={cssObj.modalContainer}
        className={className}
        onClick={(event) => event.stopPropagation()}
      >
        <div css={cssObj.header}>
          <h2 id={titleId} css={cssObj.title}>
            {title}
          </h2>
          <div css={cssObj.headerButtonWrapper}>
            <button
              type="button"
              onClick={onClose}
              css={cssObj.closeButton}
              aria-label="Close modal"
            >
              <MovelinkIcon />
            </button>
            <button
              type="button"
              onClick={onClose}
              css={cssObj.closeButton}
              aria-label="Close modal"
            >
              <CloseIcon />
            </button>
          </div>
        </div>

        <div css={cssObj.bodyLayout}>
          <nav aria-label={`${title} 메뉴`}>
            <ul css={cssObj.menuList}>
              {menus.map((menu) => {
                const isActive = (effectiveActiveMenuId ?? menus[0]?.id) === menu.id;
                return (
                  <li key={menu.id}>
                    <button
                      type="button"
                      css={[cssObj.menuItem, isActive && cssObj.activeMenuItem]}
                      onClick={() => handleSelectMenu(menu.id)}
                    >
                      {menu.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <section css={cssObj.contentWrapper} aria-live="polite">
            <div css={cssObj.contentInner}>{activeMenu?.content}</div>
          </section>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
