import { create } from 'zustand';
import { LabelForm } from '@/common/types';

interface DraftData {
  title: string;
  introduce: string;
  showImg: string[];
  labelform: LabelForm;
}

interface activeInfoState {
  title: string;
  introduce: string;
  showImg: string[];
  labelform: LabelForm;
  draftData: DraftData;
  setBasicInfo: (title: string, description: string, imgUrl: string[]) => void;
  setLabelForm: (labelform: LabelForm) => void;
  setDraftData: (draftData: DraftData) => void;
}

const emptyLabelForm: LabelForm = {
  type: '',
  holderType: '',
  organizerUnit: '',
  startTime: '',
  endTime: '',
  position: '',
  address: '',
  ifRegister: '',
  activeForm: '',
  registerMethod: '',
  signer: [],
};

const useActiveInfoStore = create<activeInfoState>((set) => ({
  title: '',
  introduce: '',
  showImg: [],
  labelform: { ...emptyLabelForm },
  draftData: {
    title: '',
    introduce: '',
    showImg: [],
    labelform: { ...emptyLabelForm },
  },
  setBasicInfo: (title: string, description: string, imgUrl?: string[]) => {
    set({ title, introduce: description, showImg: imgUrl });
  },
  setLabelForm: (labelform: LabelForm) => {
    set({ labelform });
  },
  setDraftData: (draftData: DraftData) => {
    set({ draftData });
  },
}));

export default useActiveInfoStore;
