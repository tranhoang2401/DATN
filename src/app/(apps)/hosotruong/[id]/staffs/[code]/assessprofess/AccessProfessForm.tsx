"use client";

import FormActions from "@/components/form/FormActions";
import { api } from "@/trpc/react";
import { AccessProcess } from "@/types";
import { Checkbox, Flex, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { useParams } from "next/navigation";
import { FC, useEffect } from "react";

interface Props {
  data?: AccessProcess;
  isSubmitting?: boolean;
  onSubmit: (values) => void;
  onDelete?: () => void;
  onClose?: () => void;
}

const AccessProfessForm: FC<Props> = ({ data, isSubmitting, onSubmit, onClose }) => {
  const { code } = useParams();

  const { data: staffData, isLoading } = api.staffs.getById.useQuery(code as string);
  const form = useForm({
    initialValues: data
      ? {
          ...data
        }
      : {},
    validateInputOnChange: true,
    validate: {}
  });

  useEffect(() => {
    if (staffData) {
      form.setFieldValue("code", staffData.code);
    }
  }, [staffData]);

  return (
    <>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack>
          <Flex gap="xs" align={{ base: "stretch", sm: "flex-start" }} direction={{ base: "column", sm: "row" }}>
            <TextInput withAsterisk data-autofocus label="Tiêu chí" {...form.getInputProps("criteria")} />
            <TextInput
              withAsterisk
              data-autofocus
              label="Nội dung đánh giá"
              {...form.getInputProps("evaluationcontent")}
            />
          </Flex>
          <Flex gap="xs" align={{ base: "stretch", sm: "flex-start" }} direction={{ base: "column", sm: "row" }}>
            <TextInput data-autofocus label="Mức độ đánh giá" {...form.getInputProps("evaluationlevel")} />
            <TextInput data-autofocus label="Minh chứng" {...form.getInputProps("proof")} />
          </Flex>
          <FormActions
            centered
            isNew={!data || !data.id}
            isSubmitting={isSubmitting}
            canSubmit={form.isDirty() && form.isValid()}
            onClose={() => (onClose ? onClose() : modals.closeAll())}
          />
        </Stack>
      </form>
    </>
  );
};

export default AccessProfessForm;
