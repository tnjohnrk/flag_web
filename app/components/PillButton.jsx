'use client';

import React from 'react';
import Link from 'next/link';
import './PillButton.css';

export default function PillButton({
  children,
  href,
  onClick,
  type = 'button',
  variant = 'gold', // 'gold', 'gold-dark', 'whatsapp', 'navy', 'glass', 'outline', 'danger', 'success'
  size = 'md', // 'sm', 'md', 'lg'
  pillColor,
  pillTextColor,
  className = '',
  target,
  rel,
  disabled = false,
  as: ComponentOverride,
  ...rest
}) {
  const isLink = Boolean(href);
  const isExternal = Boolean(
    target === '_blank' ||
      (href &&
        (href.startsWith('http://') ||
          href.startsWith('https://') ||
          href.startsWith('tel:') ||
          href.startsWith('mailto:')))
  );

  const Comp =
    ComponentOverride || (isLink ? (isExternal ? 'a' : Link) : 'button');

  const customStyle = {
    ...(pillColor ? { '--pb-fill': pillColor } : {}),
    ...(pillTextColor ? { '--pb-hover-text': pillTextColor } : {}),
    ...rest.style,
  };

  const commonProps = {
    className: `pill-btn pill-btn--${variant} pill-btn--${size} ${className} ${
      disabled ? 'pill-btn--disabled' : ''
    }`.trim(),
    style: customStyle,
    onClick,
    ...rest,
  };

  if (isLink) {
    return (
      <Comp
        href={href}
        target={target}
        rel={isExternal && target === '_blank' ? 'noopener noreferrer' : rel}
        {...commonProps}
      >
        <span className="pill-btn__fill" aria-hidden="true" />
        <span className="pill-btn__content">{children}</span>
      </Comp>
    );
  }

  return (
    <button type={type} disabled={disabled} {...commonProps}>
      <span className="pill-btn__fill" aria-hidden="true" />
      <span className="pill-btn__content">{children}</span>
    </button>
  );
}
