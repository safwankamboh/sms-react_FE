import { createContext, useCallback, useMemo, useState } from 'react'

export const UIContext = createContext(null)

export function UIProvider({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [modal, setModal] = useState(null)

  const openSidebar = useCallback(() => setIsSidebarOpen(true), [])
  const closeSidebar = useCallback(() => setIsSidebarOpen(false), [])
  const toggleSidebar = useCallback(
    () => setIsSidebarOpen((current) => !current),
    [],
  )
  const openModal = useCallback((content) => setModal(content), [])
  const closeModal = useCallback(() => setModal(null), [])

  const value = useMemo(
    () => ({
      isSidebarOpen,
      openSidebar,
      closeSidebar,
      toggleSidebar,
      modal,
      openModal,
      closeModal,
    }),
    [
      isSidebarOpen,
      openSidebar,
      closeSidebar,
      toggleSidebar,
      modal,
      openModal,
      closeModal,
    ],
  )

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>
}
