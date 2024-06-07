import { createContext, useContext } from 'react';

import { Stores } from '@app/store';

const StoreContext = createContext<Stores>({} as Stores)

export const StoreProvider = StoreContext.Provider
export const useStore = (): Stores => useContext(StoreContext)
