type inputType = 'textInpput' | 'dateChoice' | 'SimpChoice' 

interface formType {
    text: string,
    type: inputType,
    reminder: string,
    required: boolean,
    options?: string[],
    disabled: boolean,
}

export default formType;
export { inputType };