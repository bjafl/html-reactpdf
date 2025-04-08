import { View } from "@react-pdf/renderer";
import { HeaderFooterProps } from "./types";
import { FC, PropsWithChildren } from "react";

const Footer: FC<PropsWithChildren<HeaderFooterProps>> = ({
  height: heightProp,
  paddingBottom,
  paddingHorizontal,
  paddingTop,
  style,
  children,
}) => {
  const height = heightProp || style?.height || 70;
  return (
    <>
      {/*Ensures proper margin at bottom of page*/}
      <View fixed style={{ width: "100%", height }} />
      <View
        fixed
        style={{
          ...{
            paddingBottom: 10,
            paddingTop: 20,
            paddingHorizontal: 50,
          },
          ...style,
          paddingBottom,
          paddingTop,
          paddingHorizontal,
          height,
          ...{
            position: "absolute",
            bottom: 0,
            flexDirection: "row",
            display: "flex",
            width: "100%",
          },
        }}
      >{children}</View>
    </>
  );
};

export default Footer;
