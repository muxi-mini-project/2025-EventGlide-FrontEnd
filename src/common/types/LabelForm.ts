type LabelForm = {
  type: string;
  holderType: string;
  startTime: string;
  endTime: string;
  position: string;
  if_register: string;
  activeForm?: string;
  register_method?: string;
  signer: { name: string; studentid: string }[];
};

export default LabelForm;
