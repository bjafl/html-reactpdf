import { View } from "@react-pdf/renderer";
import { HeaderFooterProps } from "./types";
import { FC, PropsWithChildren } from "react";

const Header: FC<PropsWithChildren<HeaderFooterProps>> = ({
  height,
  paddingBottom,
  paddingHorizontal,
  paddingTop,
  style,
  children
}) => {
  return (
    <View
      fixed
      style={{
        ...{
          height: 80,
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
          flexDirection: "row",
          display: "flex",
          width: "100%",
        },
      }}
    >
      {children}
    </View>
  );
};

export default Header;
