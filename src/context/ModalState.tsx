import { createContext, useState } from 'react';

export interface IModalContext {
  modal: boolean;
  showModal: () => void;
  hideModal: () => void;
}

export const modalContext = createContext<IModalContext>({
  modal: false,
  showModal: () => {
    return;
  },
  hideModal: () => {
    return;
  },
});

const ModalState = ({ children }: { children: React.ReactNode }) => {
  const [modal, setModal] = useState(false);

  const showModal = () => setModal(true);
  const hideModal = () => setModal(false);
  return (
    <modalContext.Provider value={{ modal, showModal, hideModal }}>
      {children}
    </modalContext.Provider>
  );
};

export default ModalState;
