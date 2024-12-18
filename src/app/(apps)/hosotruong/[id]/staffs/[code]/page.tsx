"use client";

import { Loading } from "@/components/common";
import { PageHeader } from "@/components/layout";
import useNotify, { Action } from "@/hooks/useNotify";
import { useTranslation } from "@/i18n";
import { api } from "@/trpc/react";
import { Paper, Stack, Tabs } from "@mantine/core";
import { useRouter } from "next/navigation";
import StaffForm from "../StaffForm";
import AdvancedTrainingPage from "./AdvancedTraining";
import DisciplinePage from "./Discipline";
import AccessProcessPage from "./AssessProfess";

const Update = ({ params }) => {
  const router = useRouter();
  const { notifyResult } = useNotify();

  const context = api.useUtils();
  const { mutateAsync: updateStaffs, isLoading: updateLoading } = api.staffs.update.useMutation({
    onSuccess: async () => {
      await context.staffs.get.invalidate();
      notifyResult(Action.Update, "giáo viên", true);
      router.push(`/hosotruong/${params.school_code}/staffs`);
    },
    onError: (e) => {
      notifyResult(Action.Update, "giáo viên", false, e.message);
    }
  });

  const { data, isLoading } = api.staffs.getById.useQuery(params.code);

  return (
    <Stack>
      <PageHeader mb="10" title="Thông tin giáo viên" />

      <Tabs defaultValue="general">
        <Tabs.List>
          <Tabs.Tab value="general">Thông tin chung</Tabs.Tab>
          <Tabs.Tab value="advancedtraining">Bồi dưỡng nâng cao NLSP</Tabs.Tab>
          <Tabs.Tab value="discipline">Kỉ luật</Tabs.Tab>
          <Tabs.Tab value="assessprofess">Đánh giá chuẩn nghề nghiệp</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="general" pt="xs">
          <Paper p={{ base: "md", md: "lg", xl: 24 }}>
            {data ? (
              <StaffForm data={data} onSubmit={updateStaffs} isSubmitting={isLoading || updateLoading} />
            ) : (
              <Loading />
            )}
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="advancedtraining" pt="xs">
          <Paper p={{ base: "md", md: "lg", xl: 24 }}>
            <AdvancedTrainingPage />
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="discipline" pt="xs">
          <Paper p={{ base: "md", md: "lg", xl: 24 }}>
            <DisciplinePage />
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="assessprofess" pt="xs">
          <Paper p={{ base: "md", md: "lg", xl: 24 }}>
            <AccessProcessPage />
          </Paper>
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
};

export default Update;
