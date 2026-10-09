"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import ContactFormPanel from "./ContactFormPanel";

type ContactOverlayContextType = {
  isContactOpen: boolean;
  openContact: () => void;
  closeContact: () => void;
};

const ContactOverlayContext = createContext<ContactOverlayContextType | null>(
  null,
);

export function useContactOverlay() {
  const context = useContext(ContactOverlayContext);

  if (!context) {
    throw new Error(
      "useContactOverlay must be used inside ContactOverlayProvider",
    );
  }

  return context;
}

export default function ContactOverlayProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isContactOpen, setIsContactOpen] = useState(false);

  const openContact = useCallback(() => {
    setIsContactOpen(true);
  }, []);

  const closeContact = useCallback(() => {
    setIsContactOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      isContactOpen,
      openContact,
      closeContact,
    }),
    [isContactOpen, openContact, closeContact],
  );

  return (
    <ContactOverlayContext.Provider value={value}>
      {children}

      <ContactFormPanel isOpen={isContactOpen} onClose={closeContact} />
    </ContactOverlayContext.Provider>
  );
}
