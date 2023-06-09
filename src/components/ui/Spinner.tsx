import React, { type FC } from "react";

interface SpinnerProps {
   width?: number;
   height?: number;
   color?: string;
}

export const Spinner: FC<SpinnerProps> = ({ width: propsWidth, height: propsHeight, color: propsColor }) => {
   const width: number = propsWidth ?? 100;
   const height: number = propsHeight ?? 100;
   const color: string = propsColor ?? "#434c5e";

   return (
      <div className="spinner-border" style={{ width, height, color, fontSize: "40px" }} role="status">
         <span className="visually-hidden">Loading...</span>
      </div>
   );
};

type LightSpinnerProps = Omit<SpinnerProps, "color">;

export const LightSpinner: FC<LightSpinnerProps> = (props) => <Spinner {...props} color="#e5e9f0" />;
