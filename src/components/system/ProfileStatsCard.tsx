import { Flex, MantineColor, Paper, PaperProps, Progress, Stack, Text, ThemeIcon } from "@mantine/core";
import { FC, createElement } from "react";

type Props = {
  amount: number;
  title: string;
  icon: any;
  color: MantineColor;
  progressValue: number;
  asCurrency?: boolean;
} & PaperProps;

const ProfileStatsCard: FC<Props> = ({ amount, color, title, icon, progressValue, asCurrency, ...others }) => {
  return (
    <Paper {...others}>
      <Flex align="center" justify="space-between" mb="md">
        <Stack gap={2}>
          <Text size="lg" fw={700} tt="capitalize">
            {asCurrency && "$ "}
            {amount}
          </Text>
          <Text size="sm" c="dimmed" tt="capitalize">
            {title}
          </Text>
        </Stack>
        <ThemeIcon color={color} size="lg" radius="xl">
          {createElement(icon, { style: { fontSize: 16 } })}
        </ThemeIcon>
      </Flex>
      <Progress value={progressValue} color={color} size="sm" />
    </Paper>
  );
};

export default ProfileStatsCard;
