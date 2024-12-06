"use client";

import { useTranslation } from "@/i18n";
import { createClient } from "@/utils/supabase/client";
import { Button, Flex, PasswordInput, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const { t } = useTranslation("auth");
  const router = useRouter();
  const supabase = createClient();
  const form = useForm({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
    validateInputOnChange: true,
    validate: {
      email: (val) =>
        val.length === 0
          ? t("message.required", { name: t("email") })
          : /^\S+@\S+$/.test(val)
            ? null
            : t("message.invalid", { name: t("email") }),
      password: (val) => (val.length === 0 ? t("message.required", { name: t("password") }) : null),
      name: (val) => (val.length === 0 ? t("message.required", { name: t("name") }) : null),
      confirmPassword: (value, values) => (value !== values.password ? t("notMatch") : null)
    }
  });

  const handleSubmit = async (values:  any) => {
    const { data, error } = await supabase.auth.signUp({
      email: "example@email.com",
      password: "example-password"
    });
  };

  return (
    <form>
      <TextInput label={t("signup.name")} placeholder={t("signup.nameHint")} required {...form.getInputProps("name")} />
      <TextInput label={t("email")} placeholder={t("email.hint")} required mt="md" {...form.getInputProps("email")} />
      <PasswordInput
        label={t("password")}
        placeholder={t("password.hint")}
        {...form.getInputProps("password")}
        required
        mt="md"
      />
      <PasswordInput
        label={t("signup.confirmPassword")}
        placeholder={t("signup.confirmPasswordHint")}
        {...form.getInputProps("confirmPassword")}
        required
        mt="md"
      />
      <Button fullWidth mt="xl" component={Link} href="/">
        {t("signup.create")}
      </Button>
    </form>
  );
}
