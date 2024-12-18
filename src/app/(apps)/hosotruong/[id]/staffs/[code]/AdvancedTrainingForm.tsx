"use client";

import FormActions from "@/components/form/FormActions";
import { api } from "@/trpc/react";
import { AdvancedTrain } from "@/types";
import { Flex, Stack, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { useParams } from "next/navigation";
import { FC, useEffect } from "react";

interface Props {
  data?: AdvancedTrain;
  isSubmitting?: boolean;
  onSubmit: (values) => void;
  onDelete?: () => void;
  onClose?: () => void;
}

const AdvancedTrainingForm: FC<Props> = ({ data, isSubmitting, onSubmit, onClose }) => {
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
            <TextInput withAsterisk data-autofocus label="Khóa đào tạo bồi dưỡng" {...form.getInputProps("name")} />
            <TextInput
              withAsterisk
              data-autofocus
              label="Loại hình bồi dưỡng"
              {...form.getInputProps("trainingform")}
            />
          </Flex>
          <Flex gap="xs" align={{ base: "stretch", sm: "flex-start" }} direction={{ base: "column", sm: "row" }}>
            <TextInput data-autofocus label="Đơn vị bồi dưỡng" {...form.getInputProps("project")} />
            <TextInput data-autofocus label="Kết quả đạt được" {...form.getInputProps("description")} />
          </Flex>
          <Flex gap="xs" align={{ base: "stretch", sm: "flex-start" }} direction={{ base: "column", sm: "row" }}>
            <DateInput
              valueFormat="DD/MM/YYYY"
              label="Ngày bắt đầu"
              placeholder="Nhập ngày bắt đầu"
              {...form.getInputProps("date")}
            />
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

export default AdvancedTrainingForm;
