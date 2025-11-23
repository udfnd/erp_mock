import React from 'react';
import { SayongjaListItem } from '../../api/sayongja.schema';
import ListViewLayout from '@/common/layouts/ListViewLayout';
import { SayongjasList } from './_atomic/SayongjaList';

export function SayongjasLv(props: { gigwanNanoId: string }) {
  const [selectedSayongjas, setSelectedSayongjas] = React.useState<SayongjaListItem[]>([]);
  return (
    <ListViewLayout
      selectedItems={selectedSayongjas}
      NoneSelectedComponent={<div>NoneSelectedComponent</div>}
      OneSelectedComponent={<div>OneSelectedComponent</div>}
      MultipleSelectedComponent={<div>MultipleSelectedComponent</div>}
    >
      <SayongjasList
        gigwanNanoId={props.gigwanNanoId}
        selectedItems={selectedSayongjas}
        setSelectedItems={setSelectedSayongjas}
      />
    </ListViewLayout>
  );
}
