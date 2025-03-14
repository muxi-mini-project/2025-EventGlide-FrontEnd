type inputType = 'textInpput' | 'dateChoice' | 'SimpChoice' 

type formType = {
    text: string,
    type: inputType,
    reminder: string,
    options?: string[]
}

export default formType;
export { inputType };