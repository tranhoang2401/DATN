"use client";

import React from "react";
import SchoolsForm from "../SchoolForm";
import { PageHeader } from "@/components/layout";
import { Grid, Paper, PaperProps, Stack, Tabs, Text, Group, Title, Divider } from "@mantine/core";
import ProfileCard from "../ProfileCard";
import { api } from "@/trpc/react";
import { useParams } from "next/navigation";
import { IconUserCheck } from "@tabler/icons-react";

const PAPER_PROPS: PaperProps = {
  p: "md",
  style: { height: "100%" }
};

const SchoolsPage = () => {
  // const context = api.useUtils();
  const params = useParams();

  const { data: schoolData } = api.schools.getById.useQuery(params.id as string);
  return (
    <div>
      <PageHeader mb="lg" title="Hồ sơ trường" />
      <Tabs w={"100%"} defaultValue="general">
        <Grid gutter={{ base: "lg", md: "xl", xl: 24 }}>
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Stack>
              <ProfileCard name={schoolData?.school_name} subtitle={schoolData?.email || ""} {...PAPER_PROPS} />
              <Paper {...PAPER_PROPS}>
                <Tabs.List>
                  <Tabs.Tab value="general">
                    <Group>
                      <IconUserCheck size={24} />
                      <Text>"Thông tin trường học"</Text>
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
                  Thông tin trường học
                </Title>
                <Text c={"gray"} size="sm">
                  Các thông tin cơ bản về trường học, liên lạc
                </Text>
                <Divider mt={"md"} mb={"xl"} size={"md"} />
                <Title order={4}>Thông tin chính</Title>
                <Text c={"gray"} size="sm">
                  Các thông tin quan trọng
                </Text>
                <Divider my={"md"} variant="dotted" />
                <Grid>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>Tên trường: </Text>
                    <Text fw={500}>{schoolData?.school_name}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>Mã định danh: </Text>
                    <Text fw={500}>{schoolData?.school_code}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>Loại hình: </Text>
                    <Text fw={500}>{schoolData?.school_type}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>Loại trường: </Text>
                    <Text fw={500}>{schoolData?.school_category}</Text>
                  </Grid.Col>
                </Grid>
                <Grid>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>Hiệu trưởng: </Text>
                    <Text fw={500}>{schoolData?.principal_name}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>ĐT hiệu trưởng: </Text>
                    <Text fw={500}>{schoolData?.principal_phone}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>ĐT của trường: </Text>
                    <Text fw={500}>{schoolData?.phone_number}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>Email: </Text>
                    <Text fw={500}>{schoolData?.email}</Text>
                  </Grid.Col>
                </Grid>
                <Grid>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>Địa chỉ trường học: </Text>
                    <Text fw={500}>{schoolData?.address}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>Xã: </Text>
                    <Text fw={500}>{schoolData?.commune}</Text>
                  </Grid.Col>
                  <Grid.Col span={{ base: 12, md: 3 }}>
                    <Text c={"gray"}>Huyện: </Text>
                    <Text fw={500}>{schoolData?.district}</Text>
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
