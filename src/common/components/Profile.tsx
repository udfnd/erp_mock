'use client';

import React from 'react';
import {
  containerBase,
  containerRecipe,
  nameBase,
  nameRecipe,
  photoBase,
  photoRecipe,
  type PhotoRecipeOptions,
} from './Profile.style';

export type ProfileProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: PhotoRecipeOptions['size'];
  variant?: PhotoRecipeOptions['variant'];
  name?: string;
  imageUrl?: string;
  className?: string;
};

export const Profile = React.forwardRef<HTMLDivElement, ProfileProps>(
  ({ size = 'medium', variant = 'default', name, imageUrl, className, ...props }, ref) => {
    const containerStyles = containerRecipe({ size });
    const photoStyles = photoRecipe({ size, variant });
    const nameStyles = nameRecipe({ size });

    return (
      <div ref={ref} css={[containerBase, ...containerStyles]} className={className} {...props}>
        <img src={imageUrl} alt={name || 'Profile Photo'} css={[photoBase, ...photoStyles]} />
        {name && <span css={[nameBase, ...nameStyles]}>{name}</span>}
      </div>
    );
  },
);

Profile.displayName = 'Profile';
