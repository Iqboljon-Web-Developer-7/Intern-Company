import { Button, Form, Input, message } from "antd";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import api from "../../axios/api";

const Register = () => {
  const mutation = useMutation({
    mutationFn: (values: {
      fullName: string;
      login: string;
      password: string;
    }) => api.post("/auths/sign-up", values),
    onSuccess: (res) => {
      console.log("Response:", res);
      message.success("Регистрация успешна!");
    },
    onError: (error: any) => {
      console.error("Registration Error:", error);
      message.error(error?.response?.data);
    },
  });

  const onFinish = (values: any) => {
    mutation.mutate(values);
  };

  return (
    <div className="w-96 pt-5 pb-3 shadow-lg border border-gray-300 bg-slate-50 !rounded-sm">
      <h3 className="text-2xl font-bold mb-4 px-6 leading-6">Регистрация</h3>

      <Form layout="vertical" onFinish={onFinish}>
        <div className="px-6">
          <Form.Item
            label="Ф.И.О"
            name="fullName"
            rules={[{ required: true, message: "Введите Ф.И.О" }]}
          >
            <Input placeholder="Введите Ф.И.О" />
          </Form.Item>
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
            <Link to={"/auth/login"} className="text-blue-500">
              Вход
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
            Регистрировать
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Register;
