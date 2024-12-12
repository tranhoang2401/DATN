"use client";

import FormActions from "@/components/form/FormActions";
import { api } from "@/trpc/react";
import { Student } from "@/types";
import { Flex, NumberInput, Select, Stack, Textarea, TextInput } from "@mantine/core";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useParams, useRouter } from "next/navigation";
import { FC, useEffect } from "react";

interface Props {
  data?: Student;
  isSubmitting?: boolean;
  onSubmit: (values) => void;
  onDelete?: () => void;
  onClose?: () => void;
}

const StudentForm: FC<Props> = ({ data, isSubmitting, onSubmit, onClose }) => {
  const params = useParams();
  const router = useRouter();

  const { data: schoolData } = api.schools.getById.useQuery(params.id as string);

  const form = useForm({
    initialValues: data
      ? {
          ...data,
          dob: new Date(Number(data.dob))
        }
      : {
          fullname: "",
          school_code: "",
          code: "",
          dob: undefined, // Date in ISO format
          gradelevel: undefined,
          studentstatus: "",
          class: "",
          ethnicity: "",
          nationality: "",
          permanentresidenceaddress: "",
          gender: ""
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
            <NumberInput withAsterisk label="Khối lớp" {...form.getInputProps("gradelevel")} />
            <TextInput label="Lớp" {...form.getInputProps("class")} />
          </Flex>

          <Flex gap="xs" align={{ base: "stretch", sm: "flex-start" }} direction={{ base: "column", sm: "row" }}>
            <TextInput withAsterisk label="Họ và tên" {...form.getInputProps("fullname")} />
            <TextInput withAsterisk label="Mã học sinh" {...form.getInputProps("code")} />
            <DateInput
              placeholder="Nhập ngày sinh"
              label="Ngày sinh"
              valueFormat="DD/MM/YYYY"
              {...form.getInputProps("dob")}
            />
          </Flex>

          <Flex gap="xs" align={{ base: "stretch", sm: "flex-start" }} direction={{ base: "column", sm: "row" }}>
            <Select
              label="Giới tính"
              data={[
                { value: "male", label: "Nam" },
                { value: "female", label: "Nữ" }
              ]}
              {...form.getInputProps("gender")}
            />
            <Select
              label="Trạng thái học sinh"
              data={[
                { value: "Đang học", label: "Đang học" },
                { value: "Đã nghỉ học", label: "Đã nghỉ học" }
              ]}
              {...form.getInputProps("studentstatus")}
            />
            <TextInput label="Dân tộc" {...form.getInputProps("ethnicity")} />
          </Flex>

          <Flex gap="xs" align={{ base: "stretch", sm: "flex-start" }} direction={{ base: "column", sm: "row" }}>
            <TextInput label="Quốc tịch" {...form.getInputProps("nationality")} />
            <Textarea label="Nơi cư trú thường xuyên" {...form.getInputProps("permanentresidenceaddress")} />
          </Flex>
          <FormActions
            centered
            isNew={!data || !data.id}
            isSubmitting={isSubmitting}
            canSubmit={form.isDirty() && form.isValid()}
            onClose={() => (onClose ? onClose() : router.push(`/hosotruong/${schoolData?.id}/students`))}
          />
        </Stack>
      </form>
    </>
  );
};

export default StudentForm;
