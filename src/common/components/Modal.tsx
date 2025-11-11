'use client';

import React, { ReactNode, useCallback, useEffect, useMemo, useState } from 'react';
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
  const [isMounted, setIsMounted] = useState(false);
  const [activeMenuId, setActiveMenuId] = useState<string | undefined>(initialMenuId);
  const titleId = useMemo(
    () => `modal-title-${Math.random().toString(36).slice(2, 9)}`,
    [],
  );

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const defaultMenuId = initialMenuId ?? menus[0]?.id;
    setActiveMenuId((prev) => prev ?? defaultMenuId);
  }, [initialMenuId, isOpen, menus]);

  useEffect(() => {
    if (!menus.length) {
      setActiveMenuId(undefined);
      return;
    }

    const exists = menus.some((menu) => menu.id === activeMenuId);

    if (!exists) {
      setActiveMenuId(initialMenuId ?? menus[0].id);
    }
  }, [activeMenuId, initialMenuId, menus]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleSelectMenu = useCallback((menuId: string) => {
    setActiveMenuId(menuId);
  }, []);

  const activeMenu = useMemo(() => {
    if (!menus.length) {
      return undefined;
    }

    return menus.find((menu) => menu.id === activeMenuId) ?? menus[0];
  }, [activeMenuId, menus]);

  if (!isOpen || !isMounted) {
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
                const isActive = (activeMenu?.id ?? menus[0]?.id) === menu.id;

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
