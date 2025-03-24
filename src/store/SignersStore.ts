import { create } from "zustand";

interface SignersStoreType {
  signers: { id: number; name: string; studentid: string }[];
  setAddSigner: (signer: { id: number; name: string; studentid: string }) => void;
  setRemoveSigner: (signerId: number) => void;
}

const useSignersStore = create<SignersStoreType>((set) => ({
  signers: [],
  setAddSigner: (signer) =>
    set((state) => ({
      signers: [...state.signers, signer],
    })),
  setRemoveSigner: (signerid) =>
    set((state) => {
      const updatedSigners = state.signers.filter(
        (signer) => signer.id !== signerid,
      );
      const reindexedSigners = updatedSigners.map((signer, index) => ({
        ...signer,
        
        id: index + 1,
      }));
      return { signers: reindexedSigners };
    }),
}));

export default useSignersStore;
