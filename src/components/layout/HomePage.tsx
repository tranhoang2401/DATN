"use client";

import { Container, Grid, Title, Text, Card, Image } from "@mantine/core";

// Dữ liệu mẫu cho các bài viết
const articles = [
  {
    id: 1,
    title: "Thành Tựu Nổi Bật Trong Năm Học 2023-2024",
    image: "https://via.placeholder.com/300x200",
    description: "Phòng giáo dục đã gặt hái được nhiều thành tựu quan trọng trong năm học vừa qua.",
    date: "10/06/2024"
  },
  {
    id: 2,
    title: "Kế Hoạch Tuyển Sinh Cho Năm Học Mới",
    image: "https://via.placeholder.com/300x200",
    description: "Chi tiết kế hoạch tuyển sinh cho năm học 2024-2025 đã được công bố.",
    date: "15/06/2024"
  },
  {
    id: 3,
    title: "Hoạt Động Ngoại Khóa Bổ Ích Cho Học Sinh",
    image: "https://via.placeholder.com/300x200",
    description: "Các hoạt động ngoại khóa giúp học sinh phát triển toàn diện hơn.",
    date: "12/06/2024"
  },
  {
    id: 4,
    title: "Tập huấn Ngoại khóa cho giáo viên",
    image: "https://via.placeholder.com/300x200",
    description: "Giúp cho giáo viên thực hiện các hoạt động ngoại khóa cho học sinh 1 cách tốt hơn.",
    date: "12/06/2024"
  }
];

export default function HomePage() {
  return (
    <div
      style={{
        padding: "20px"
      }}>
      {/* Banner */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "400px",
          marginBottom: "40px"
        }}>
        <Image src="/anh_carousel.png" alt="Banner" height={400} fit="cover" />
      </div>

      {/* Các bài viết */}
      <Container style={{ marginTop: "40px" }}>
        <Grid gutter="md">
          {articles.map((article, index) => (
            <Grid.Col key={index} span={3}>
              <Card shadow="sm" padding="lg" radius="md" withBorder style={{ height: "100%" }}>
                <Card.Section>
                  <Image
                    src={article.image}
                    alt={article.title}
                    height={200}
                    style={{
                      objectFit: "cover",
                      borderRadius: "8px",
                      width: "100%"
                    }}
                  />
                </Card.Section>
                <Title order={3} style={{ marginTop: "16px", fontSize: "1.25rem" }}>
                  {article.title}
                </Title>
                <Text size="sm" color="dimmed" style={{ marginTop: "10px" }}>
                  {article.description}
                </Text>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </Container>
    </div>
  );
}
