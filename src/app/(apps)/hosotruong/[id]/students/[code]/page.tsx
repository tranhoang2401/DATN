"use client";

import { Loading } from "@/components/common";
import { PageHeader } from "@/components/layout";
import useNotify, { Action } from "@/hooks/useNotify";
import { useTranslation } from "@/i18n";
import { api } from "@/trpc/react";
import { Paper, Stack } from "@mantine/core";
import { useRouter } from "next/navigation";
import StudentForm from "../StudentForm";

const Update = ({ params }) => {
  const router = useRouter();
  const { notifyResult } = useNotify();

  const context = api.useUtils();
  const { mutateAsync: updatestudents, isLoading: updateLoading } = api.student.update.useMutation({
    onSuccess: async () => {
      await context.student.get.invalidate();
      notifyResult(Action.Update, "học sinh", true);
      router.push(`/hosotruong/${params.school_code}/students`);
    },
    onError: (e) => {
      notifyResult(Action.Update, "học sinh", false, e.message);
    }
  });

  const { data, isLoading } = api.student.getById.useQuery(params.code);

  return (
    <Stack>
      <PageHeader mb="10" title="Sửa đổi thông tin học sinh" />

      <Paper p={{ base: "md", md: "lg", xl: 24 }}>
        {data ? (
          <StudentForm data={data} onSubmit={updatestudents} isSubmitting={isLoading || updateLoading} />
        ) : (
          <Loading />
        )}
      </Paper>
    </Stack>
  );
};

export default Update;
