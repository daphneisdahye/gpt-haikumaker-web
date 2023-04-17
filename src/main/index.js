import "./index.css";
import { API_URL } from "../config/constants.js";
import React, { useEffect } from "react";
import { Card, Button, Form, Input, message, Pagination } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import axios from "axios";
import { SmileOutlined } from "@ant-design/icons";

const { Meta } = Card;

dayjs.extend(relativeTime);

function MainPage() {
  const [haikus, setHaikus] = React.useState([]);
  const [form] = Form.useForm();
  const [totalPages, setTotalPages] = React.useState(1);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(9);

  useEffect(
    function () {
      let params = {
        page: currentPage,
        limit: pageSize,
      };
      axios
        .get(`${API_URL}/haikus`, { params })
        .then(function (result) {
          const haikus = result.data.haikus;
          const totalPages = result.data.totalPages;
          setHaikus(haikus);
          setTotalPages(totalPages);
        })
        .catch(function (err) {
          console.error("error:", err);
        });
    },
    [currentPage]
  );

  const colors = [
    "#FFC5B5",
    "#FFD5C5",
    "#FFE5D5",
    "#F5ECCE",
    "#DAE9CA",
    "#BCE2C1",
    "#ACE1D1",
    "#C1DCE8",
    "#D0D9E8",
    "#E0DCE8",
    "#EAD1DC",
    "#FFC2E2",
    "#F7ACCF",
    "#FFBE7D",
    "#F2E3DE",
    "#B4DEE4",
    "#FFA1A1",
    "#E8A87C",
    "#C38D9E",
  ];

  const onPageChange = (page) => {
    // ページ番号をアップデート
    setCurrentPage(page);
  };

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
      .post(`${API_URL}/haikus`, {
        author: values.author,
        words: values.words,
        color1: color1,
        color2: color2,
      })
      .then((result) => {
        console.log("情報が送信されました:", result.data);
        setCurrentPage(1);
        form.resetFields();
        axios
          .get(`${API_URL}/haikus`)
          .then((result) => {
            setHaikus(result.data.haikus);
            setTotalPages(result.data.totalPages);
          })
          .catch((err) => {
            console.error("error:", err);
          });
      })
      .catch((err) => {
        console.error(err);
        message.error(`エラーが発生しました。 ${err.message}`);
      });
  };

  return (
    <div>
      <div className="haiku-info">
        <span className="main-text">
          chatGPTと俳句を作ってみよう
          <SmileOutlined style={{ fontSize: "24px", marginLeft: "8px" }} />
        </span>
        <span className="sub-text">1~3つの単語を入力してください</span>

        <Form form={form} name="俳句入力" onFinish={onSubmit}>
          <div className="form-container">
            <Form.Item
              className="form-item"
              label={<div className="haiku-label">登録者名:</div>}
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
            <Button className="haiku-button" size="large" htmlType="submit">
              俳句作り
            </Button>
          </Form.Item>
        </Form>
      </div>
      <h2>俳句のLIST</h2>

      <div className="haikus-list">
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
                style={{ width: 300 }}
                cover={
                  <div
                    className="gradient-cover"
                    style={{
                      "--color1": haiku.color1,
                      "--color2": haiku.color2,
                      height: "200px",
                    }}
                  >
                    <div
                      className="haiku-content"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {haiku.content
                        .replace(/[\d.]+/g, "")
                        .replace(/、/g, "\r\n")
                        .replace(/ /g, "\r\n")
                        .replace(/\s+/g, "\r\n")
                        .trim()}
                    </div>
                  </div>
                }
              >
                <Meta title={haiku.author} description={haiku.words} />
                <span
                  style={{
                    position: "absolute",
                    bottom: 0,
                    right: "0",
                    transform: "translateX(0%)",
                    opacity: 0.3,
                    margin: "20px",
                  }}
                >
                  {dayjs(haiku.createdAt).fromNow()}
                </span>
              </Card>
            );
          })
        )}
      </div>
      <div className="pagination-container">
        <Pagination
          current={currentPage}
          onChange={onPageChange}
          total={totalPages * pageSize}
          pageSize={pageSize}
          itemRender={(current, type, originalElement) => {
            if (type === "page") {
              return (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: 32,
                  }}
                >
                  {originalElement}
                </div>
              );
            }
            return originalElement;
          }}
        />
      </div>
    </div>
  );
}

export default MainPage;
