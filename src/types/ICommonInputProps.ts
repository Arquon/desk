export interface ICommonInputProps {
   label: string;
   error?: string;
}

export interface ICommonTextInputProps extends ICommonInputProps {
   value: string;
   onChange: (value: string) => void;
}
