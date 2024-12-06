"use client";

import { PageHeader } from "@/components/layout";
import useNotify, { Action } from "@/hooks/useNotify";
import { api } from "@/trpc/react";
import { Paper, Stack } from "@mantine/core";
import { useRouter } from "next/navigation";
import StudentForm from "../StudentForm";

const Create = () => {
  const router = useRouter();
  const { notifyResult } = useNotify();
  const context = api.useUtils();

  const { mutateAsync: createStudent, isLoading } = api.student.create.useMutation({
    onSuccess: async () => {
      await context.invalidate();
      notifyResult(Action.Create, "học sinh", true);
      router.back();
    },
    onError: (e) => {
      notifyResult(Action.Create, "học sinh", false, e.message);
    }
  });

  const handleSubmit = async (values: any) => {
    await createStudent(values);
  };

  return (
    <Stack>
      <PageHeader mb="10" title="Thêm mới học sinh" />

      <Paper p={{ base: "md", md: "lg", xl: 24 }}>
        <StudentForm isSubmitting={isLoading} onSubmit={handleSubmit} />
      </Paper>
    </Stack>
  );
};
export default Create;
