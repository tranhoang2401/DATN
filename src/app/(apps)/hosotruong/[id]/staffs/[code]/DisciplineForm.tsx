"use client";

import FormActions from "@/components/form/FormActions";
import { api } from "@/trpc/react";
import { Discipline } from "@/types";
import { Checkbox, Flex, Select, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { useParams } from "next/navigation";
import { FC, useEffect } from "react";

interface Props {
  data?: Discipline;
  isSubmitting?: boolean;
  onSubmit: (values) => void;
  onDelete?: () => void;
  onClose?: () => void;
}

const DisciplineForm: FC<Props> = ({ data, isSubmitting, onSubmit, onClose }) => {
  const params = useParams();

  const { data: staffData } = api.staffs.getById.useQuery(params.code as string);
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
            <TextInput withAsterisk data-autofocus label="Loại kỷ luật" {...form.getInputProps("disciplinetype")} />
            <TextInput withAsterisk data-autofocus label="Ngày kỷ luật" {...form.getInputProps("decisiondate")} />
          </Flex>
          <Flex gap="xs" align={{ base: "stretch", sm: "flex-start" }} direction={{ base: "column", sm: "row" }}>
            <TextInput withAsterisk data-autofocus label="Lí do kỉ luật" {...form.getInputProps("disciplinereason")} />
            <TextInput withAsterisk data-autofocus label="Cấp ký quyết định" {...form.getInputProps("decisioncode")} />
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

export default DisciplineForm;
