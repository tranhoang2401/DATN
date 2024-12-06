"use client";

import { PageHeader } from "@/components/layout";
import useNotify, { Action } from "@/hooks/useNotify";
import { api } from "@/trpc/react";
import { Paper, Stack } from "@mantine/core";
import { useRouter } from "next/navigation";
import StaffForm from "../StaffForm";

const Create = () => {
  const router = useRouter();
  const { notifyResult } = useNotify();
  const context = api.useUtils();

  const { mutateAsync: createStaff, isLoading } = api.staffs.create.useMutation({
    onSuccess: async () => {
      await context.invalidate();
      notifyResult(Action.Create, "giáo viên", true);
      router.back();
    },
    onError: (e) => {
      notifyResult(Action.Create, "giáo viên", false, e.message);
    }
  });

  const handleSubmit = async (values: any) => {
    await createStaff(values);
  };

  return (
    <Stack>
      <PageHeader mb="10" title="Thêm mới giáo viên" />

      <Paper p={{ base: "md", md: "lg", xl: 24 }}>
        <StaffForm isSubmitting={isLoading} onSubmit={handleSubmit} />
      </Paper>
    </Stack>
  );
};
export default Create;
