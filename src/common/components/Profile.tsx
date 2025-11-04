import { clsx } from 'clsx';
import React from 'react';

import { containerRecipe, nameRecipe, photoRecipe, type PhotoRecipeOptions } from './Profile.style.css';

export type ProfileProps = React.HTMLAttributes<HTMLDivElement> & {
  size?: PhotoRecipeOptions['size'];
  variant?: PhotoRecipeOptions['variant'];
  name?: string;
  imageUrl?: string;
  className?: string;
};

export const Profile = React.forwardRef<HTMLDivElement, ProfileProps>(
  ({ size = 'medium', variant = 'default', name, imageUrl, className, ...props }, ref) => {
    const containerClasses = containerRecipe({ size });
    const photoClasses = photoRecipe({ size, variant });
    const nameClasses = nameRecipe({ size });

    return (
      <div ref={ref} className={clsx(containerClasses, className)} {...props}>
        <img src={imageUrl} alt={name || 'Profile Photo'} className={photoClasses} />
        {name && <span className={nameClasses}>{name}</span>}
      </div>
    );
  },
);

Profile.displayName = 'Profile';
