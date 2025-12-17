import {
  List,
  Card,
  Tag,
  Space,
  Button,
  Typography,
  Flex
} from "antd";

const { Text, Title } = Typography;


const RecipeListPage = ({ data }) => {
  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: 16 }}>
      <Title level={3}>Filtered Recipes</Title>

      <List
        itemLayout="vertical"
        size="large"
        dataSource={data}
        renderItem={(item) => (
          <List.Item key={item._id}>
            <Card>
              <Space direction="vertical" size="small" style={{ width: "100%" }}>
                {/* TITLE */}
                <Flex justify="space-between" align="center">
                  <Title level={4} style={{ margin: 0 }}>
                    {item.name}
                  </Title>
                  <Tag color="green">{item.diet}</Tag>
                </Flex>

                {/* META */}
                <Space wrap>
                  <Tag color="blue">{item.course}</Tag>
                  <Tag color="purple">{item.state}</Tag>
                  <Tag>
                    Prep: {item.prep_time} min
                  </Tag>
                  <Tag>
                    Cook: {item.cook_time} min
                  </Tag>
                </Space>

                {/* INGREDIENTS */}
                <Text strong>Ingredients:</Text>
                <Text>{item.ingredients}</Text>

                {/* MISSING INGREDIENTS */}
                {item.missing_ingredients?.count > 0 && (
                  <>
                    <Text strong>
                      Missing Ingredients ({item.missing_ingredients.count}):
                    </Text>
                    <Space wrap>
                      {item.missing_ingredients.missing_ingredients.map((ing, idx) => (
                        <Tag key={idx} color="red">
                          {ing}
                        </Tag>
                      ))}
                    </Space>
                  </>
                )}

                {/* YOUTUBE LINK */}
                <Button
                  type="link"
                  href={item.youtube_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Watch on YouTube
                </Button>
              </Space>
            </Card>
          </List.Item>
        )}
      />
    </div>
  );
};

export default RecipeListPage;


