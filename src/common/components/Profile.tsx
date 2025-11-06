'use client';

import React from 'react';
import Image from 'next/image';
import {
  containerBase,
  containerRecipe,
  nameBase,
  nameRecipe,
  photoBase,
  photoWrapperBase,
  photoWrapperRecipe,
  type PhotoRecipeOptions,
} from './Profile.style';

export type ProfileProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: PhotoRecipeOptions['size'];
  variant?: PhotoRecipeOptions['variant'];
  name?: string;
  imageUrl?: string;
  className?: string;
  unoptimized?: boolean;
  priority?: boolean;
};

const FALLBACK = 'https://placehold.co/48x48';

export const Profile = React.forwardRef<HTMLDivElement, ProfileProps>(
  (
    {
      size = 'medium',
      variant = 'default',
      name,
      imageUrl,
      className,
      unoptimized,
      priority,
      ...props
    },
    ref,
  ) => {
    const containerStyles = containerRecipe({ size });
    const frameStyles = photoWrapperRecipe({ size, variant });
    const nameStyles = nameRecipe({ size });

    return (
      <div ref={ref} css={[containerBase, ...containerStyles]} className={className} {...props}>
        <span css={[photoWrapperBase, ...frameStyles]}>
          <Image
            src={imageUrl || FALLBACK}
            alt={name || 'Profile Photo'}
            fill
            priority={priority ?? size === 'large'}
            unoptimized={unoptimized}
            css={[photoBase]}
          />
        </span>
        {name && <span css={[nameBase, ...nameStyles]}>{name}</span>}
      </div>
    );
  },
);

Profile.displayName = 'Profile';
