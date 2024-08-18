import React, { useCallback, useEffect, useState } from 'react'
import { Input, Layout, Menu, Modal, Space, Table } from 'antd'
import { Content } from 'antd/es/layout/layout'
import { TeamOutlined, SettingOutlined, } from '@ant-design/icons';
import Sider from 'antd/es/layout/Sider';
import { useAuthContext } from '../../../context/AuthContext';
import { collection, deleteDoc, doc, getDocs, setDoc } from 'firebase/firestore';
import { firestore } from '../../../config/firebase';
import moment from 'moment'


export default function Home() {
  const { handleLogout } = useAuthContext()
  const [state, setState] = useState({});
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1');
  const [users, setUsers] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false);

  // close Modal
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // fetch data from firebase
  const getUsers = useCallback(async () => {
    const querySnapshot = await getDocs(collection(firestore, "users"));
    const array = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()

      array.push(data);
      setUsers(array)
    });
  }, [])

  useEffect(() => {
    getUsers();
  }, [])

  // layout options
  const items = [
    { key: '1', icon: < TeamOutlined />, label: 'Users' },
    {
      key: '2', icon: <SettingOutlined />, label: 'Setting', children: [
        { key: '3', label: 'Account' },
        { key: '4', label: 'Update' },
        { key: '5', label: 'logout', onClick: handleLogout }
      ]
    }
  ]

  // handle select menu option
  const onMenuClick = e => setSelectedKey(e.key);

  // table header data 
  const columns = [
    { title: 'No.', dataIndex: 'number', key: 'number' },
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Email', dataIndex: 'email', key: 'email' },
    { title: 'Add Date', dataIndex: 'createdAt', key: 'createdAt' },
    { title: 'User Id', dataIndex: 'id', key: 'id' },
    {
      title: 'Role', dataIndex: 'role', key: 'role',
      render: (role) => (
        <span style={{ color: role.includes('admin') ? 'green' : 'red' }}>
          {role}
        </span>
      )
    },
    {
      title: 'Action', key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <button className='btn btn-warning btn-sm' onClick={() => handleEdit(record)}>Edit</button>
          <button className='btn btn-danger btn-sm' onClick={() => handleDelete(record)}>Delete</button>
        </Space>
      ),
    },
  ];

  // table map user data
  const data = users.map((u, i) => ({
    key: i + 1,
    number: i + 1,
    name: u.fullName,
    email: u.email,
    createdAt: u.createdAt ? moment(u.createdAt.seconds * 1000).format('YYYY-MM-DD') : 'N/A',
    id: u.id,
    role: u.roles ? u.roles.join(', ') : 'N/A',
  }))

  // handle change state 
  const handleChange = e => setState(s => ({ ...s, [e.target.name]: e.target.value }))

  // handle user edit
  const handleEdit = (record) => {
    setIsModalOpen(true)

    const filterUser = users.find(user => user.id === record.id)
    if (filterUser) { setState(filterUser) }

  }


  // confirm ok for updation
  const handleOk = async () => {
    const updatedUser = state

    try {
      await setDoc(doc(firestore, "users", state.id), updatedUser);

      setIsModalOpen(false)
      window.toastify("Updated User Successfully", 'succes')
      const updatedUsers = users.map(user => user.id === state.id ? { ...user, fullName: state.fullName } : user)
      setUsers(updatedUsers)
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  }

  // delete user
  const handleDelete = async (record) => {
    try {
      await deleteDoc(doc(firestore, "users", record.id));
      const updatedUser = users.filter(u => u.id !== record.id)
      setUsers(updatedUser)
      window.toastify("User Deleted SuccessFully", 'success')

    } catch (e) {
      console.error("Error deleting document: ", e);
    }
  }


  return (
    <>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
          <div className="demo-logo-vertical" />
          <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} onClick={onMenuClick} />
        </Sider>
        <Layout>
          <Content>
            {selectedKey === '1' &&
              (<div>
                <div>
                  <h2 className='my-5 text-center'>Users</h2>
                </div>
                <div className='table-responsive'>
                  <Table columns={columns} dataSource={data} />
                </div>
              </div>
              )}

          </Content>
        </Layout>
      </Layout>
      {/* model component */}
      <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <div className="row mb-3">
          <div className="col">
            <Input type='text' size="large" placeholder="Name" name='fullName' value={state.fullName} onChange={handleChange} />
          </div>
        </div>

      </Modal>
    </>
  )
}
