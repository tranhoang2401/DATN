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

const StaffForm: FC<Props> = ({ data, isSubmitting, onSubmit, onClose }) => {
  const params = useParams();
  const router = useRouter();

  const { data: schoolData } = api.schools.getById.useQuery(params.id as string);

  const { data: staffData, isLoading } = api.staffs.getById.useQuery(params.code as string);
  const form = useForm({
    initialValues: data
      ? {
          ...data,
          dob: new Date(Number(data.dob))
        }
      : {
          name: "",
          school_code: "",
          code: "",
          dob: undefined,
          gender: "",
          employmentstatus: "",
          idcard: "",
          pid: "",
          email: "",
          phonenumber: "",
          ethnicity: "",
          religion: "",
          socialinsurancenumber: "",
          address: "",
          hometown: ""
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
          {/* Row 1 */}
          <Flex gap="xs" align={{ base: "stretch", sm: "flex-start" }} direction={{ base: "column", sm: "row" }}>
            <TextInput label="Mã trường" {...form.getInputProps("school_code")} />
            <TextInput withAsterisk label="Tên giáo viên" {...form.getInputProps("name")} />
            <TextInput withAsterisk label="Mã giáo viên" {...form.getInputProps("code")} />
          </Flex>

          {/* Row 2 */}
          <Flex gap="xs" align={{ base: "stretch", sm: "flex-start" }} direction={{ base: "column", sm: "row" }}>
            <DateInput
              valueFormat="DD/MM/YYYY"
              label="Ngày sinh"
              placeholder="Nhập ngày sinh"
              {...form.getInputProps("dob")}
            />
            <Select
              label="Giới tính"
              data={["Nam", "Nữ", "Khác"]}
              placeholder="Chọn giới tính"
              {...form.getInputProps("gender")}
            />
            <Select
              label="Trạng thái công việc"
              data={["Hoạt động", "Ngừng hoạt động", "Khác"]}
              {...form.getInputProps("employmentStatus")}
            />
          </Flex>

          {/* Row 3 */}
          <Flex gap="xs" align={{ base: "stretch", sm: "flex-start" }} direction={{ base: "column", sm: "row" }}>
            <TextInput label="Số CMND/CCCD" {...form.getInputProps("idcard")} />
            <TextInput label="Số định danh cá nhân" {...form.getInputProps("pid")} />
            <TextInput label="Email" {...form.getInputProps("email")} />
          </Flex>

          {/* Row 4 */}
          <Flex gap="xs" align={{ base: "stretch", sm: "flex-start" }} direction={{ base: "column", sm: "row" }}>
            <TextInput label="Số điện thoại" {...form.getInputProps("phonenumber")} />
            <TextInput label="Dân tộc" {...form.getInputProps("ethnicity")} />
            <TextInput label="Tôn giáo" {...form.getInputProps("religion")} />
          </Flex>

          {/* Row 5 */}
          <Flex gap="xs" align={{ base: "stretch", sm: "flex-start" }} direction={{ base: "column", sm: "row" }}>
            <TextInput label="Số bảo hiểm xã hội" {...form.getInputProps("socialInsuranceNumber")} />
            <TextInput label="Địa chỉ thường trú" {...form.getInputProps("address")} />
            <TextInput label="Quê quán" {...form.getInputProps("hometown")} />
          </Flex>
          <FormActions
            centered
            isNew={!data || !data.id}
            isSubmitting={isSubmitting}
            canSubmit={form.isDirty() && form.isValid()}
            onClose={() => (onClose ? onClose() : router.push(`/hosotruong/${schoolData?.id}/staffs`))}
          />
        </Stack>
      </form>
    </>
  );
};

export default StaffForm;
