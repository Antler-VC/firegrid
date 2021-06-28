import React, { useContext, useState, useEffect, useRef } from 'react';
import { RouteComponentProps } from 'react-router';

import { db } from '../firebase';
import useDoc from '../hooks/useDoc';

import { EmptyState, Loading } from '@antlerengineering/components';

import { DB_ROOT_LISTS } from 'constants/firegrid';
import { List } from 'types/List';
import { _newList, _deleteList } from 'utils/helpers';
import { useAppContext } from './AppContext';
import { routes } from 'constants/routes';

export interface IListEditorContextInterface {
  lists: List[];
  selectedListRef: React.MutableRefObject<List | null>;
  selectedList: List | null;
  setSelectedListId: (id: string) => void;
  updateSelectedList: (data: Record<string, any>) => void;
  newList: ReturnType<typeof _newList>;
  deleteList: ReturnType<typeof _deleteList>;
}

export const ListEditorContext =
  React.createContext<IListEditorContextInterface>({
    lists: [],
    selectedListRef: { current: null },
    selectedList: null,
    setSelectedListId: () => {},
    updateSelectedList: () => {},
    newList: async () => {},
    deleteList: async () => {},
  });
export default ListEditorContext;

export const useListEditorContext = () => useContext(ListEditorContext);

export function ListEditorProvider({
  children,
  match,
  history,
}: React.PropsWithChildren<RouteComponentProps<{ id?: string }>>) {
  const { currentUser } = useAppContext();

  // Get all lists once
  const [lists, setLists] = useState<List[] | 'loading'>('loading');
  useEffect(() => {
    db.collection(DB_ROOT_LISTS)
      .where('name', '!=', 'DEV')
      .get()
      .then((snapshot) =>
        setLists(
          snapshot.docs.map(
            (docSnapshot) =>
              ({ ...docSnapshot.data(), id: docSnapshot.id } as List)
          )
        )
      );
  }, [match.params?.id]);

  // Set up listener for selected list
  const [selectedListState, selectedListDispatch, updateSelectedList] = useDoc(
    match.params?.id ? { path: `${DB_ROOT_LISTS}/${match.params!.id}` } : {}
  );
  // Add a ref so helper functions get fresh list data
  const selectedListRef = useRef<List | null>(null);
  selectedListRef.current = selectedListState.doc;
  const selectedList = selectedListState.doc;

  // Change selected list based on URL
  useEffect(() => {
    const path = `${DB_ROOT_LISTS}/${match.params!.id}`;
    if (selectedListState.path !== path) selectedListDispatch({ path });
  }, [match.params?.id]);

  // Set selected list & update URL
  const setSelectedListId = (id: string) => {
    selectedListDispatch({
      path: `${DB_ROOT_LISTS}/${id}`,
      loading: true,
      doc: null,
    });

    history.push(routes.listEditor + '/' + id);
  };

  if (lists === 'loading') return <Loading message="Loading lists" />;
  if (lists.length === 0) return <EmptyState message="No lists to edit" />;

  if (selectedListState.loading && selectedListState.path)
    return <Loading message="Loading list" />;

  // Helper write functions
  const newList = _newList(currentUser!, history);
  const deleteList = _deleteList(history);

  return (
    <ListEditorContext.Provider
      value={{
        lists,
        selectedListRef,
        selectedList,
        setSelectedListId,
        updateSelectedList,
        newList,
        deleteList,
      }}
    >
      {children}
    </ListEditorContext.Provider>
  );
}
