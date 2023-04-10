import "./index.css";
import React, { useEffect } from "react";
import { Card, Button, Form, Input, message } from "antd";

import axios from "axios";
import { SmileOutlined } from "@ant-design/icons";
const { Meta } = Card;

function MainPage() {
  const [haikus, setHaikus] = React.useState([]);
  const [form] = Form.useForm();

  useEffect(function () {
    axios
      .get("http://localhost:8080/haikus")
      .then(function (result) {
        const haikus = result.data.haikus;
        setHaikus(haikus);
        console.log("haikus:", haikus);
      })
      .catch(function (err) {
        console.error("error:", err);
      });
  }, []);

  const colors = [
    "#ef5777",
    "#575fcf",
    "#4bcffa",
    "#34e7e4",
    "#0be881",
    "#f53b57",
    "#3c40c6",
    "#0fbcf9",
    "#00d8d6",
    "#05c46b",
    "#ffc048",
    "#ffdd59",
    "#ff5e57",
    "#d2dae2",
    "#485460",
    "#ffa801",
    "#ffd32a",
    "#ff3f34",
  ];

  const onSubmit = (values) => {
    // 단어 구분자로 단어 분리하기
    const wordsCount = values.words.split(/,|、/);
    // 단어 개수가 1~3개인지 확인하기
    if (wordsCount.length < 1 || wordsCount.length > 3) {
      message.error("1~3つの単語を入力してください。");
      return;
    }

    const randomIndex1 = Math.floor(Math.random() * colors.length);
    const randomIndex2 = Math.floor(Math.random() * colors.length);
    const color1 = colors[randomIndex1];
    const color2 = colors[randomIndex2];

    axios
      .post(`http://localhost:8080/haikus`, {
        author: values.author,
        words: values.words,
        color1: color1,
        color2: color2,
      })
      .then((result) => {
        console.log("정상적으로 정보가 전송되었습니다:", result.data);
        axios
          .get("http://localhost:8080/haikus")
          .then((result) => {
            const haikus = result.data.haikus;
            setHaikus(haikus);
            console.log("haikus:", haikus);
          })
          .catch((err) => {
            console.error("error:", err);
          });
        form.resetFields();
      })
      .catch((err) => {
        console.error(err);
        message.error(`エラーが発生しました。 ${err.message}`);
      });
  };

  return (
    <div>
      <div id="haiku-info">
        <span className="main-text">
          chatGPTと俳句を作成してみよう
          <SmileOutlined style={{ fontSize: "24px", marginLeft: "8px" }} />
        </span>
        <span className="sub-text">
           1~3つの単語を入力してください          
        </span>
        
        <Form form={form} name="俳句入力" onFinish={onSubmit}>
          <div className="form-container">
            <Form.Item
              className="form-item"
              label={<div className="haiku-label">作家さん:</div>}
              name="author"
              rules={[{ required: true, message: "名前を入力してください。" }]}
            >
              <Input className="haiku-name" size="middle" />
            </Form.Item>
            <Form.Item
              className="form-item"
              label={<div className="haiku-label">言葉:</div>}
              name="words"
              rules={[
                { required: true, message: "1~3つの単語入力してください。" },
              ]}
            >
              <Input
                className="haiku-words"
                size="middle"
                placeholder="例) パンダ、竹、愛 " 
              />
              
            </Form.Item>
          </div>
          <Form.Item>
            <Button id="haiku-button" size="large" htmlType="submit">
              俳句作り
            </Button>
          </Form.Item>
        </Form>
      </div>
      <h2>俳句のLIST</h2>

      <div id="haikus-list">
        {haikus.length === 0 ? (
          <div>
            <span>俳句がありません。</span>
          </div>
        ) : (
          haikus.map(function (haiku, index) {
            return (
              <Card
                key={index} 
                hoverable
                style={{ width: 240 }}
                cover={
                  <div
                    className="gradient-cover"
                    style={{
                      "--color1": haiku.color1,
                      "--color2": haiku.color2,
                    }}
                  >
                    <div
                      className="haiku-content"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {haiku.content}
                    </div>
                  </div>
                }
              >
                <Meta title={haiku.words} description={haiku.author} />
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

export default MainPage;
