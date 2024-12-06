"use client";

import React from "react";
import { PageHeader } from "@/components/layout";
import { Grid, Paper, PaperProps, Stack, Tabs, Text, Group, Title, Divider } from "@mantine/core";
import ProfileCard from "@/app/(apps)/hosotruong/ProfileCard";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import { IconUserCheck } from "@tabler/icons-react";
import { localeDate } from "@/lib/datetime";

const PAPER_PROPS: PaperProps = {
  p: "md",
  style: { height: "100%" }
};

const SchoolsPage = () => {
  // const context = api.useUtils();
  const params = useParams();

  const { data: schoolData } = api.schools.getById.useQuery(params.id as string);

  const { data: staffData } = api.staffs.getById.useQuery(schoolData?.school_code as string);
  return (
    <div>
      <PageHeader mb="lg" title="Hồ sơ giáo viên" />
      <Tabs w={"100%"} defaultValue="general">
        <Grid gutter={{ base: "lg", md: "xl", xl: 24 }}>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack>
              <ProfileCard name={staffData?.name || ""} subtitle={schoolData?.email || ""} {...PAPER_PROPS} />
              <Paper {...PAPER_PROPS}>
                <Tabs.List>
                  <Tabs.Tab value="general">
                    <Group>
                      <IconUserCheck size={24} />
                      <Text>"Thông tin giáo viên"</Text>
                    </Group>
                  </Tabs.Tab>
                </Tabs.List>
              </Paper>
            </Stack>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Paper {...PAPER_PROPS}>
              <Tabs.Panel value="general">
                <Title c={"green"} order={3}>
                  Thông tin giáo viên
                </Title>
                <Text c={"gray"} size="sm">
                  Các thông tin cơ bản về giáo viên, liên lạc, địa chỉ cư trú
                </Text>
                <Divider mt={"md"} mb={"xl"} size={"md"} />
                <Title order={4}>Thông tin chính</Title>
                <Text c={"gray"} size="sm">
                  Các thông tin quan trọng
                </Text>
                <Divider my={"md"} variant="dotted" />
                <Grid>
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <Text c={"gray"}>Tên giáo viên: </Text>
                    <Text fw={500}>{staffData?.name}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <Text c={"gray"}>Mã định danh: </Text>
                    <Text fw={500}>{staffData?.code}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <Text c={"gray"}>Ngày sinh: </Text>
                    <Text fw={500}>{staffData?.dob ? localeDate(staffData?.dob) : ""}</Text>
                  </Grid.Col>
                </Grid>
                <Grid>
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <Text c={"gray"}>Số CMND/CCCD: </Text>
                    <Text fw={500}>{staffData?.idcard}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <Text c={"gray"}>Số định danh cá nhân: </Text>
                    <Text fw={500}>{staffData?.pid}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 4 }}>
                    <Text c={"gray"}>Trạng thái hoạt động: </Text>
                    <Text fw={500}>{staffData?.employmentstatus}</Text>
                  </Grid.Col>
                </Grid>
                <Grid>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>Giới tính: </Text>
                    <Text fw={500}>{staffData?.gender}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>Email: </Text>
                    <Text fw={500}>{staffData?.email}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>Số điện thoại: </Text>
                    <Text fw={500}>{staffData?.phonenumber}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>Website: </Text>
                    <Text fw={500}>{schoolData?.website}</Text>
                  </Grid.Col>
                </Grid>
                <Grid>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>Khu vực: </Text>
                    <Text fw={500}>{schoolData?.region}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>Chuẩn quốc gia mức độ: </Text>
                    <Text fw={500}>{schoolData?.national_standard_level}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>Trường quốc tế: </Text>
                    <Text fw={500}>{schoolData?.international_school}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>Đạt kiểm định chất lượng: </Text>
                    <Text fw={500}>{schoolData?.quality_assurance}</Text>
                  </Grid.Col>
                </Grid>
                <Grid>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>Đạt mức chất lượng tối thiểu: </Text>
                    <Text fw={500}>{schoolData?.minimum_quality_level}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>Có chi bộ Đảng: </Text>
                    <Text fw={500}>{schoolData?.has_party_committee}</Text>
                  </Grid.Col>
                </Grid>
              </Tabs.Panel>
            </Paper>
          </Grid.Col>
        </Grid>
      </Tabs>
    </div>
  );
};

export default SchoolsPage;
