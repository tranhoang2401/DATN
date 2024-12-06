"use client";

import { AppMain } from "@/components/layout";
import { TLinkList } from "@/components/layout/Navigation";
import { IconChartBar } from "@tabler/icons-react";
import { PropsWithChildren } from "react";
import { useParams } from "next/navigation";
import { api } from "@/trpc/react";

export default function AppLayout({ children }: PropsWithChildren) {
  const params = useParams();

  const { data: schoolData, isLoading: isLoadingSchoolData } = api.schools.getById.useQuery(params.id as string);
  const links: TLinkList = [
    {
      label: "Quản lí học sinh",
      icon: IconChartBar,
      url: `/hosotruong/${schoolData?.id}/students`
    },
    {
      label: "Quản lí giáo viên",
      icon: IconChartBar,
      url: `/hosotruong/${schoolData?.id}/staffs`
    },
    {
      label: "Quản lí cơ sở vật chất",
      icon: IconChartBar,
      url: `/hosotruong/${schoolData?.id}/facilities`
    },
    {
      label: "Báo cáo",
      icon: IconChartBar
      //   url: SYSTEM_PATHS.root
    }
  ];

  return <AppMain links={links}>{children}</AppMain>;
}
