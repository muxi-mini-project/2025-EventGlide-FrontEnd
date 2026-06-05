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
  startTime: '',
  endTime: '',
  position: '',
  ifRegister: '',
  activeForm: '111',
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
