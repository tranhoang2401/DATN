import { Button, Paper, PaperProps, Stack, Text } from "@mantine/core";
import { IconSend } from "@tabler/icons-react";
import { FC } from "react";
import { useAuthStore } from "../auth/AuthContext";
import { LetterAvatar } from "../common";

type Props = {
  subtitle?: string;
} & PaperProps;

const UserProfileCard: FC<Props> = async ({ subtitle, ...others }) => {
  const authUser = useAuthStore()((s) => s.authUser);

  return (
    <Paper {...others}>
      <Stack gap={4} align="center">
        <LetterAvatar url={authUser?.user_metadata?.image} name={authUser?.email} size={120} mx="auto" mb="md" />
        {/* <Text fz="md" fw={500} mt="md" mx="auto">
          {authUser?.name}
        </Text> */}
        <Text c="dimmed" fz="xs" component="a" href={`mailto:${authUser?.email}`}>
          {authUser?.email}
        </Text>
        {subtitle && (
          <Text c="dimmed" fz="xs" ta="center">
            {subtitle}
          </Text>
        )}

        <Button variant="outline" fullWidth mt="md" rightSection={<IconSend size={14} />}>
          Send message
        </Button>
      </Stack>
    </Paper>
  );
};

export default UserProfileCard;
