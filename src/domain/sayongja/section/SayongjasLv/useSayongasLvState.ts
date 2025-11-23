import React from 'react';

type UseLvStateType<I, S = Partial<I>> = () => {
  selectedItems: S[];
  setSelectedItems: (items: S[]) => void;
};

export function useSayongasLvState() {
  const [selectedItems, setSelectedSayongjas] = React.useState<SayongjaListItem[] | 'add'>([]);

  return {
    selectedSayongjas,
    setSelectedSayongjas,
  };
}
