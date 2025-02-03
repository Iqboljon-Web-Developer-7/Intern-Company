import { Button, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import api from "../../axios/api";

const Login = () => {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (values: { login: string; password: string }) =>
      api.post("/auths/sign-in", values),
    onSuccess: (res) => {
      console.log("Response:", res);
      message.success("Вход успешен!");
      localStorage.setItem("token", res.data);
      navigate("/");
    },
    onError: (error) => {
      console.error("Login Error:", error);
      message.error("Ошибка входа. Проверьте данные.");
    },
  });

  const onFinish = (values: any) => {
    mutation.mutate(values);
  };

  return (
    <div className="w-96 pt-5 pb-3 shadow-lg border border-gray-300 bg-slate-50 !rounded-sm">
      <h3 className="text-2xl font-bold mb-4 px-6 leading-6">Вход</h3>
      <Form layout="vertical" onFinish={onFinish}>
        <div className="px-6">
          <Form.Item
            label="Логин"
            name="login"
            rules={[{ required: true, message: "Введите логин" }]}
          >
            <Input placeholder="Введите логин" />
          </Form.Item>
          <Form.Item
            label="Пароль"
            name="password"
            rules={[{ required: true, message: "Введите пароль" }]}
          >
            <Input.Password placeholder="Введите пароль" />
          </Form.Item>
          <div className="flex justify-between items-center pb-2">
            <Link to={"/auth/register"} className="text-blue-500">
              Регистрация
            </Link>
          </div>
        </div>
        <div className="pt-3 flex justify-between items-center border-t border-slate-200">
          <Button
            type="primary"
            htmlType="submit"
            className="!bg-[#7EB203] mx-auto !rounded-sm"
            loading={mutation.isPending}
          >
            Вход
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Login;
