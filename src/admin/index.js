import "./index.css";
import { API_URL } from "../config/constants.js";
import React, { useEffect } from "react";
import { Card, Button, Form, Input, message, Pagination } from "antd";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import axios from "axios";
import { SmileOutlined, CloseSquareOutlined } from "@ant-design/icons";


const { Meta } = Card;

dayjs.extend(relativeTime);

function AdminPage() {
  const [haikus, setHaikus] = React.useState([]);
  const [form] = Form.useForm();
  const [totalPages, setTotalPages] = React.useState(1);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(9);
  const [passwordCorrect, setPasswordCorrect] = React.useState(false);
  const [displayMessage, setDisplayMessage] = React.useState(false);


  useEffect(() => {
    if (passwordCorrect) {
      let params = {
        page: currentPage,
        limit: 9,
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
    }
  }, [passwordCorrect, currentPage, pageSize]);

  const onPageChange = (page) => {
    // ページ番号をアップデート
    setCurrentPage(page);
  };

  useEffect(() => {
    const storedPwdCorrect = localStorage.getItem("passwordCorrect") === "true";
    setPasswordCorrect(storedPwdCorrect);
    setDisplayMessage(storedPwdCorrect); 
  }, []);


  const onSubmit_pwd = (values) => {
    axios
      .post(`${API_URL}/admin`, {
        password: values.password,
      })
      .then((result) => {
        console.log("情報が送信されました。:", result.data);
        const password_check = result.data.password_check;
        if (password_check === true) {
          localStorage.setItem("passwordCorrect", "true");
          setPasswordCorrect(true);
          setDisplayMessage(true);
        } else {
          message.error("パスワードが一致しません。");
        }
      })
      .catch((err) => {
        console.error(err);
        message.error(`パスワードが一致しません。`);
      });

    form.resetFields();
  };

  const handleGoToMain = () => {
    localStorage.clear();
    setPasswordCorrect(false);
    setDisplayMessage(false);
    window.location.href = "/";
  };

  const handleDelete = (haikuId) => {
    axios
      .delete(`${API_URL}/haikus/${haikuId}`)
      .then((result) => {
        const delTotalPages = result.data.totalPages;
        if (currentPage > delTotalPages) {
          axios
          .get(`${API_URL}/haikus`,{ params: { page: delTotalPages, limit: pageSize } })
          .then((result) => {            
              setHaikus(result.data.haikus);
              setTotalPages(result.data.totalPages);         
          })
          .catch((err) => {
            console.error("error:", err);
          });
        }else{
          axios
          .get(`${API_URL}/haikus`,{ params: { page: currentPage, limit: pageSize } })
          .then((result) => {            
              setHaikus(result.data.haikus);
              setTotalPages(result.data.totalPages);         
          })
          .catch((err) => {
            console.error("error:", err);
          });

        }

        
        message.info("削除が完了しました。");
      })
      .catch((err) => {
        console.error(err);
        message.error(`Error deleting haiku: ${err.message}`);
      });
  };

  return (
    <div>
      <div className="haiku-info">
        <span className="main-text">
          Admin Page
          <SmileOutlined style={{ fontSize: "24px", marginLeft: "8px" }} />
        </span>
        {!passwordCorrect && (
          <Form form={form} name="PASSWORD" onFinish={onSubmit_pwd}>
            <div className="form-container">
              <Form.Item
                className="form-item"
                label={<div className="haiku-label">PASSWORD:</div>}
                name="password"
                rules={[{ required: true }]}
              >
                <div style={{ display: "flex" }}>
                  <Input.Password className="haiku-words" size="middle" />
                  <Button id="admin-button" size="large" htmlType="submit">
                    確認
                  </Button>
                </div>
              </Form.Item>
            </div>
          </Form>
        )}

        {displayMessage && (
          <div style={{ marginTop: "16px", marginBottom: "16px" }}>            
            <span>ログアウトしてメインページに移動する</span>        
            <div className="logout-button">
              <Button onClick={handleGoToMain}>Logout</Button>
            </div>
          </div>
        )}
      </div>

      {passwordCorrect && (
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
                  <Button
                    className="close-button"
                    type="text"
                    icon={<CloseSquareOutlined style={{ color: "black" }} />}
                    onClick={() => handleDelete(haiku.id)}
                  />
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

          <div className="pagination-container__admin">
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
      )}
    </div>
  );
}

export default AdminPage;
