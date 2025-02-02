import { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Input,
  message,
  Dropdown,
  Pagination,
} from "antd";
import {
  DeleteOutlined,
  EditOutlined,
  EllipsisOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../axios/api";
import Header from "../components/Header";

const Home = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const token = localStorage.getItem("token");

  // Redirect if not authenticated
  useEffect(() => {
    if (!token) {
      navigate("/auth/login");
    }
  }, [token, navigate]);

  // Modal state and current editing company
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any>(null);

  // Form instances for modals
  const [addForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // State for search and pagination
  const [search, setSearch] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const [pageIndex, setPageIndex] = useState(1);

  // Fetch companies list using React Query.
  // We no longer send pageSize or pageIndex as the API response is always a full array.
  const { data, isLoading } = useQuery({
    queryKey: ["companies", search],
    queryFn: async () => {
      const res = await api.get("/companies/get-all", {
        headers: { Authorization: `Bearer ${token}` },
        params: { search },
      });
      return res.data;
    },
  });

  const companies = data || [];
  const totalCount = companies.length;

  const paginatedCompanies = companies.slice(
    (pageIndex - 1) * pageSize,
    pageIndex * pageSize
  );

  // Mutation for adding a new company
  const addMutation = useMutation({
    mutationFn: async (newCompany: { name: string; count: number }) => {
      const res = await api.post("/companies/add", newCompany, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    onSuccess: () => {
      message.success("Компания успешно добавлена!");
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      setIsAddModalVisible(false);
      addForm.resetFields();
    },
    onError: (error) => {
      console.error(error);
      message.error("Ошибка добавления компании.");
    },
  });

  // Mutation for updating an existing company (using PUT)
  const updateMutation = useMutation({
    mutationFn: async (updatedCompany: {
      id: string;
      name: string;
      count: number;
    }) => {
      const res = await api.put("/companies/update", updatedCompany, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
    onSuccess: () => {
      message.success("Компания успешно обновлена!");
      queryClient.invalidateQueries({ queryKey: ["companies"] });
      setIsEditModalVisible(false);
      setEditingCompany(null);
      editForm.resetFields();
    },
    onError: (error) => {
      console.error(error);
      message.error("Ошибка обновления компании.");
    },
  });

  // Mutation for deleting a company
  const deleteMutation = useMutation({
    mutationFn: async (companyId: string) => {
      const res = await api.delete("/companies/delete/by-id", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "text/json",
        },
        data: JSON.stringify(companyId),
      });
      return res.data;
    },
    onSuccess: () => {
      message.success("Компания успешно удалена!");
      queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
    onError: (error) => {
      console.error(error);
      message.error("Ошибка удаления компании.");
    },
  });

  // Handle Add Company form submission
  const handleAddCompany = (values: any) => {
    addMutation.mutate(values);
  };

  // Handle Edit Company form submission
  const handleEditCompany = (values: any) => {
    const updatedData = {
      ...values,
      id: editingCompany.id || editingCompany._id,
    };
    updateMutation.mutate(updatedData);
  };

  // Confirm deletion
  const showDeleteConfirm = (companyId: string) => {
    Modal.confirm({
      title: "Подтвердите удаление",
      content: "Вы действительно хотите удалить эту компанию?",
      okText: "Да",
      cancelText: "Нет",
      onOk: () => {
        deleteMutation.mutate(companyId);
      },
    });
  };

  // Dropdown menu for each company with edit and delete actions
  const getMenuItems = (company: any) => ({
    items: [
      {
        key: "edit",
        label: "Редактировать",
        icon: <EditOutlined className="scale-125" />,
        onClick: () => {
          setEditingCompany(company);
          setIsEditModalVisible(true);
          editForm.setFieldsValue({
            name: company.name,
            count: company.count,
          });
        },
      },
      {
        key: "delete",
        icon: <DeleteOutlined className="!text-red-500 scale-125" />,
        label: <p className="text-red-500">Удалить</p>,
        onClick: () => showDeleteConfirm(company.id || company._id),
      },
    ],
  });

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <Header setIsAddModalVisible={setIsAddModalVisible} />

      {/* Companies List with Search and Header */}
      <main className="p-6 text-sm">
        {/* Search Bar */}
        <div className="mb-4">
          <Input.Search
            placeholder="Поиск компании"
            allowClear
            enterButton="Найти"
            size="middle"
            onSearch={(value) => {
              setSearch(value);
              setPageIndex(1); // Reset to first page for a new search
            }}
          />
        </div>

        {isLoading ? (
          <div className="loader mx-auto"></div>
        ) : (
          <>
            <div className="w-full p-4 bg-gray-50 border border-[#dddddd] grid grid-cols-6 rounded-t-md">
              <span className="col-span-2 font-semibold">
                Названия компании
              </span>
              <span className="col-span-4 font-semibold">
                Количество сотрудников
              </span>
            </div>
            <div>
              {paginatedCompanies && paginatedCompanies.length > 0 ? (
                paginatedCompanies.map((company: any) => (
                  <div
                    key={company.id || company._id}
                    className="bg-white p-4 border-b border-r border-l border-[#dddddd] relative grid grid-cols-6"
                  >
                    <span className="col-span-2">{company.name}</span>
                    <span className="col-span-4">{company.count}</span>
                    <div className="absolute top-[50%] translate-y-[-50%] right-4">
                      <Dropdown
                        menu={getMenuItems(company)}
                        trigger={["click"]}
                      >
                        <Button
                          type="text"
                          icon={
                            <EllipsisOutlined
                              rotate={90}
                              className="scale-125"
                            />
                          }
                        />
                      </Dropdown>
                    </div>
                  </div>
                ))
              ) : (
                <p>Нет данных</p>
              )}
            </div>

            {/* Pagination Component */}
            <div className="flex justify-end mt-4">
              <Pagination
                current={pageIndex}
                pageSize={pageSize}
                total={totalCount}
                showSizeChanger
                onChange={(page, newPageSize) => {
                  setPageIndex(page);
                  setPageSize(newPageSize);
                }}
                pageSizeOptions={["5", "10", "20", "50"]}
              />
            </div>
          </>
        )}
      </main>

      {/* Modal for Adding a Company */}
      <Modal
        open={isAddModalVisible}
        onCancel={() => {
          setIsAddModalVisible(false);
          addForm.resetFields();
        }}
        footer={null}
      >
        <h4 className="text-2xl font-medium mb-3">Создать компанию</h4>
        <div className="border-t border-slate-200 pt-6">
          <Form
            form={addForm}
            layout="horizontal"
            labelCol={{ span: 10 }}
            labelAlign="left"
            wrapperCol={{ span: 20 }}
            onFinish={handleAddCompany}
          >
            <Form.Item
              label="Названия компании"
              name="name"
              rules={[{ required: true, message: "Введите название компании" }]}
            >
              <Input placeholder="Введите название" />
            </Form.Item>
            <Form.Item
              label="Количество сотрудников"
              name="count"
              rules={[{ required: true, message: "Введите количество" }]}
            >
              <Input placeholder="Введите количество" type="number" />
            </Form.Item>
            <div className="border-t border-slate-200 pt-3 mt-5">
              <Form.Item
                wrapperCol={{ offset: 8, span: 16 }}
                style={{ marginBottom: 0 }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={addMutation.isPending}
                  className="!rounded-sm"
                >
                  Создать компанию
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </Modal>

      {/* Modal for Editing a Company */}
      <Modal
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingCompany(null);
          editForm.resetFields();
        }}
        footer={null}
      >
        <h4 className="text-2xl font-medium mb-3">Редактировать компанию</h4>
        <div className="border-t border-slate-200 pt-6">
          <Form
            form={editForm}
            layout="horizontal"
            labelCol={{ span: 10 }}
            labelAlign="left"
            wrapperCol={{ span: 20 }}
            onFinish={handleEditCompany}
            initialValues={editingCompany || {}}
            key={
              editingCompany ? editingCompany.id || editingCompany._id : "new"
            }
          >
            <Form.Item
              label="Названия компании"
              name="name"
              rules={[{ required: true, message: "Введите название компании" }]}
            >
              <Input placeholder="Введите название" />
            </Form.Item>
            <Form.Item
              label="Количество сотрудников"
              name="count"
              rules={[{ required: true, message: "Введите количество" }]}
            >
              <Input placeholder="Введите количество" type="number" />
            </Form.Item>
            <div className="border-t border-slate-200 pt-3 mt-5">
              <Form.Item
                wrapperCol={{ offset: 8, span: 16 }}
                style={{ marginBottom: 0 }}
              >
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={updateMutation.isPending}
                  className="!rounded-sm"
                >
                  Обновить компания
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default Home;
