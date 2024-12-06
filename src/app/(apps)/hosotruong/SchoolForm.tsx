"use client";

import FormActions from "@/components/form/FormActions";
import { Schools } from "@/types";
import { Checkbox, Flex, Select, Stack, TextInput } from "@mantine/core";
import { isNotEmpty, useForm } from "@mantine/form";
import { modals } from "@mantine/modals";
import { FC } from "react";

interface Props {
  data?: Schools;
  isSubmitting?: boolean;
  onSubmit: (values) => void;
  onDelete?: () => void;
  onClose?: () => void;
}

const SchoolsForm: FC<Props> = ({ data, isSubmitting, onSubmit, onClose }) => {
  const form = useForm({
    initialValues: data
      ? data
      : {
          school_code: "",
          school_name: "",
          school_type: "",
          school_category: "",
          principal_name: "",
          principal_phone: "",
          address: "",
          district: "",
          commune: "",
          phone_number: "",
          email: "",
          website: "",
          region: "",
          international_school: false,
          national_standard_level: "",
          quality_assurance: "",
          minimum_quality_level: false,
          has_party_committee: false
        },
    validateInputOnChange: true,
    validate: {
      school_code: isNotEmpty("Hãy nhập mã định danh trường học")
    }
  });

  console.log(form.values);

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <Flex gap="xs" align={{ base: "stretch", sm: "flex-start" }} direction={{ base: "column", sm: "row" }}>
          <TextInput withAsterisk data-autofocus label="Tên trường" {...form.getInputProps("school_name")} />
          <TextInput withAsterisk data-autofocus label="Mã định danh" {...form.getInputProps("school_code")} />
          <Select
            label="Loại trường"
            data={["Trường mầm non", "Trường tiểu học", "Trường trung học cơ sở", "Trường trung học phổ thông"]}
            {...form.getInputProps("school_type")}
          />
        </Flex>
        <Flex gap="xs" align={{ base: "stretch", sm: "flex-start" }} direction={{ base: "column", sm: "row" }}>
          <Select label="Loại hình" data={["Công lập", "Dân lập"]} {...form.getInputProps("school_type")} />
          <TextInput data-autofocus label="Hiệu trưởng" {...form.getInputProps("principal_name")} />
          <TextInput data-autofocus label="ĐT Hiệu trưởng" {...form.getInputProps("principal_phone")} />
        </Flex>
        <Checkbox
          label="Đạt mức chất lượng tối thiểu"
          {...form.getInputProps("minimum_quality_level", { type: "checkbox" })}
        />
        <Flex gap="xs" align={{ base: "stretch", sm: "flex-start" }} direction={{ base: "column", sm: "row" }}>
          <TextInput data-autofocus label="Huyện" {...form.getInputProps("district")} />
          <TextInput data-autofocus label="Xã" {...form.getInputProps("commune")} />
          <TextInput data-autofocus label="Điện thoại" {...form.getInputProps("phone_number")} />
        </Flex>
        <Checkbox label="Có chi bộ Đảng" {...form.getInputProps("has_party_committee", { type: "checkbox" })} />
        <Flex gap="xs" align={{ base: "stretch", sm: "flex-start" }} direction={{ base: "column", sm: "row" }}>
          <TextInput data-autofocus label="Email" {...form.getInputProps("email")} />
          <TextInput data-autofocus label="Website" {...form.getInputProps("website")} />
          <TextInput data-autofocus label="Khu vực" {...form.getInputProps("region")} />
        </Flex>
        <Checkbox label="Trường quốc tế" {...form.getInputProps("international_school", { type: "checkbox" })} />
        <Flex gap="xs" align={{ base: "stretch", sm: "flex-start" }} direction={{ base: "column", sm: "row" }}>
          <Select
            label="Chuẩn q.gia mức độ"
            data={[
              "Chưa đạt",
              "Chuẩn giáo dục cấp 1",
              "Chuẩn giáo dục cấp 2",
              "Chuẩn giáo dục cấp 3",
              "Chuẩn giáo dục cấp 4",
              "Chuẩn giáo dục cấp 5"
            ]}
            {...form.getInputProps("national_standard_level")}
          />
          <Select
            label="Đạt kiểm định chất lượng"
            data={["Cấp độ 1", "Cấp độ 2", "Cấp độ 3"]}
            {...form.getInputProps("quality_assurance")}
          />
        </Flex>
        <FormActions
          isNew={!data || !data.id}
          centered
          isSubmitting={isSubmitting}
          canSubmit={form.isDirty() && form.isValid()}
          onClose={() => (onClose ? onClose() : modals.closeAll())}
        />
      </Stack>
    </form>
  );
};

export default SchoolsForm;
