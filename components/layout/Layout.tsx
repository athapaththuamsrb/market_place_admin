import { Fragment } from "react";

import Header from "./Header";
import type { FC, ReactNode } from "react";
type Props = {
  children: ReactNode;
};
const Layout: FC<Props> = ({ children }) => {
  return (
    <Fragment>
      <Header />
      <main>{children}</main>
    </Fragment>
  );
};

export default Layout;
