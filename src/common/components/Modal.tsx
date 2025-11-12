'use client';

import React, { ReactNode, useCallback, useEffect, useId, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  activeMenuItemStyle,
  bodyLayoutStyle,
  closeButtonStyle,
  contentInnerStyle,
  contentWrapperStyle,
  headerStyle,
  menuItemStyle,
  menuListStyle,
  modalContainerStyle,
  overlayStyle,
  titleStyle,
} from './Modal.style';

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
    <div css={overlayStyle} role="presentation" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        css={modalContainerStyle}
        className={className}
        onClick={(event) => event.stopPropagation()}
      >
        <div css={headerStyle}>
          <h2 id={titleId} css={titleStyle}>
            {title}
          </h2>
          <button type="button" onClick={onClose} css={closeButtonStyle} aria-label="Close modal">
            ×
          </button>
        </div>

        <div css={bodyLayoutStyle}>
          <nav aria-label={`${title} 메뉴`}>
            <ul css={menuListStyle}>
              {menus.map((menu) => {
                const isActive = (effectiveActiveMenuId ?? menus[0]?.id) === menu.id;
                return (
                  <li key={menu.id}>
                    <button
                      type="button"
                      css={[menuItemStyle, isActive && activeMenuItemStyle]}
                      onClick={() => handleSelectMenu(menu.id)}
                    >
                      {menu.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <section css={contentWrapperStyle} aria-live="polite">
            <div css={contentInnerStyle}>{activeMenu?.content}</div>
          </section>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
