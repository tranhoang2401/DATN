"use client";

import { TLinkList } from "@/components/layout/Navigation";
import { IconChartBar } from "@tabler/icons-react";
import { PropsWithChildren } from "react";

export default function AppLayout({ children }: PropsWithChildren) {
  const links: TLinkList = [
    {
      label: "Quản lí trường",
      icon: IconChartBar,
      url: `/hosotruong`
    },
    {
      label: "Quản lí tài khoản",
      icon: IconChartBar,
      url: `/`
    }
  ];

  return <>{children}</>;
}
