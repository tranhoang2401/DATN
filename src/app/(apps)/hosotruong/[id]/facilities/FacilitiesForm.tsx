"use client";

import FormActions from "@/components/form/FormActions";
import { api } from "@/trpc/react";
import { Staff } from "@/types";
import { Flex, Select, Stack, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { useParams, useRouter } from "next/navigation";
import { FC, useEffect } from "react";

interface Props {
  data?: Staff;
  isSubmitting?: boolean;
  onSubmit: (values) => void;
  onDelete?: () => void;
  onClose?: () => void;
}

const FacilitiesForm: FC<Props> = ({ data, isSubmitting, onSubmit, onClose }) => {
  const params = useParams();
  const router = useRouter();

  const { data: schoolData } = api.schools.getById.useQuery(params.id as string);

  const { data: staffData, isLoading } = api.staffs.getById.useQuery(params.code as string);
  const form = useForm({
    initialValues: {
      ...data,
      classnumber: null, // Số lớp học là số nguyên không âm
      roomnumber: null, // Số phòng là số nguyên không âm
      numberstaffrooms: null, // Số phòng giáo viên là số nguyên không âm
      tablenumber: null, // Số bàn là số nguyên không âm
      projector: null, // Máy chiếu chuyển từ boolean sang int4 (0 hoặc 1)
      functionroom: null
    },
    validateInputOnChange: true,
    validate: {}
  });

  useEffect(() => {
    if (schoolData) {
      form.setFieldValue("school_code", schoolData.school_code);
    }
  }, [schoolData]);

  return (
    <>
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack>
          <Flex gap="xs" align={{ base: "stretch", sm: "flex-start" }} direction={{ base: "column", sm: "row" }}>
            <TextInput label="Mã trường" {...form.getInputProps("school_code")} />
            <TextInput withAsterisk label="Kỳ học" {...form.getInputProps("semester")} />
          </Flex>

          <Flex gap="xs" align={{ base: "stretch", sm: "flex-start" }} direction={{ base: "column", sm: "row" }}>
            <TextInput withAsterisk label="Số lớp học" {...form.getInputProps("classnumber")} />
            <TextInput withAsterisk label="Số phòng" {...form.getInputProps("roomnumber")} />
            <TextInput label="Số phòng giáo viên" {...form.getInputProps("numberstaffrooms")} />
          </Flex>

          <Flex gap="xs" align={{ base: "stretch", sm: "flex-start" }} direction={{ base: "column", sm: "row" }}>
            <TextInput label="Số bàn" {...form.getInputProps("tablenumber")} />
            <TextInput label="Máy chiếu" {...form.getInputProps("projector")} />
            <TextInput label="Phòng chức năng" {...form.getInputProps("functionroom")} />
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

export default FacilitiesForm;
