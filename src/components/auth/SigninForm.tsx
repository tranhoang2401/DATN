"use client";

import { useTranslation } from "@/i18n";
import { signInWithPassword } from "@/utils/auth-helpers/server";
import { createClient } from "@/utils/supabase/client";
import {
  Alert,
  Anchor,
  Button,
  Center,
  Checkbox,
  Group,
  MantineColor,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput
} from "@mantine/core";
import { useForm } from "@mantine/form";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import classes from "./SigninForm.module.css";

interface Message {
  title?: string | null;
  text?: string | null;
  color: MantineColor | null;
}

export default function SigninForm() {
  const { t } = useTranslation("auth");
  const params = useSearchParams();
  const [message, setMessage] = useState<Message>({ title: null, text: null, color: null });
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [redirectUrl, setRedirectUrl] = useState("");
  const supabase = createClient();

  useEffect(() => {
    const checkAuthen = async () => {
      const user = await supabase.auth.getUser();
      if (user.data.user) {
        window.location.href = redirectUrl;
      }
    };

    if (supabase && redirectUrl) checkAuthen();
  }, [supabase, redirectUrl]);

  useEffect(() => {
    const error = params.get("error");
    const error_description = params.get("error_description");
    const success = params.get("success");
    const token = params.get("token");

    if (error || error_description) {
      if (error_description && error) setMessage({ title: error, text: error_description, color: "red" });
      else setMessage({ text: error || error_description, color: "red" });
    }

    if (success) {
      setMessage({ text: success, color: "green" });
    }

    setRedirectUrl(token ? `/invitations/${token}` : "/system");
  }, [params]);

  const form = useForm({
    initialValues: {
      email: "",
      password: ""
    },
    validateInputOnBlur: true,
    validate: {
      email: (val) =>
        val.length === 0
          ? t("message.required", { name: t("email") })
          : /^\S+@\S+$/.test(val)
            ? null
            : t("message.invalid", { name: t("email") }),
      password: (val) => (val.length === 0 ? t("message.required", { name: t("password") }) : null)
    }
  });

  const handleSubmit = async (values: { email: string; password: string }) => {
    setLoading(true);
    const redirectUrl: string = await signInWithPassword(values.email, values.password);
    router.push(redirectUrl);
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  };

  return (
    <Paper className={classes.card}>
      <form onSubmit={form.onSubmit(handleSubmit)}>
        <Stack>
          {message.text && message.color ? (
            <Alert color={message.color} title={message.title}>
              {message.text}
            </Alert>
          ) : (
            <Text ta="center" mt="md">
              {t("signin.subtitle")}
            </Text>
          )}
          <TextInput
            name="email"
            label={t("email")}
            placeholder={t("email.hint")}
            required
            {...form.getInputProps("email")}
          />
          <PasswordInput
            id="password"
            name="password"
            label={t("password")}
            placeholder={t("password.hint")}
            required
            {...form.getInputProps("password")}
          />
          <Group justify="space-between">
            <Checkbox label={t("signin.remember")} />
            <Anchor href="/auth/forgot-password" fw={500} fz="sm">
              {t("signin.forgotPassword")}
            </Anchor>
          </Group>
          <Button variant="filled" type="submit" loading={loading} fullWidth mt="md">
            {t("signin.button")}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
