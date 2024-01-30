import React, { useEffect, useRef, useState } from "react";
import { WrapperHeader } from "./style";
import { Button, Form, Space } from "antd";
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponet";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import Loading from "../LoadingComponent/LoadingComponent";
import { WrapperUploadFile } from "../AdminProduct/style";
import ModalComponent from "../ModalComponent/ModalComponent";
import { getBase64 } from "../../utils";
import * as message from "../../components/Message/Message"
import { useSelector } from "react-redux";
import { useMutationHooks } from "../../hook/useMutationHook";
import * as UserServices from '../../services/UserServices'
import { useQuery } from "@tanstack/react-query";
import {EditOutlined,DeleteOutlined,SearchOutlined } from '@ant-design/icons'


const AdminUser = () => {
  const [rowSelected, setRowSelected] = useState('')
  const [isOpenDrawer, setIsOpenDrawer] = useState (false)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
  const user = useSelector((state)=>state?.user)
  const searchInput = useRef(null);

  const [stateUserDetails, setStateUserDetails] = useState({ // Đổi tên không giống
    name: '',
    email: '',
    phone: '',
    isAdmin: false,
    avatar:'',
    address:''
  })

  const [form] = Form.useForm()
  
  const mutationUpdate = useMutationHooks(
    (data) => {
      const { 
        id,
        token,
        ...rests} = data
      const res = UserServices.updateUser(
        id,
        {...rests},
        token,)
    return res
    }
  )

  const mutationDeletedMany = useMutationHooks(
    (data) => {
      const { token, ...ids
    } = data
      const res = UserServices.deleteManyUser(
        ids,
        token)
    return res
    }
  )
  const handleDeleteManyUser = (ids) => {
    mutationDeletedMany.mutate({ids: ids, token: user?.access_token},{
      onSettled: () =>{
        queryUser.refetch()
      }
    })
  }

  const mutationDeleted = useMutationHooks(
    (data) => {
      const { 
      id,
      token} = data
      const res = UserServices.deleteUser(
        id,
        token)
    return res
    }
  )

const getAllUsers = async () =>{
    const res = await UserServices.getAllUser(user?.access_token)
    return res
  }

const fetchGetDetailsUser = async (rowSelected) => {
  const res = await UserServices.getDetailsUser(rowSelected) //rowSelected là id
  if(res?.data){
    setStateUserDetails({
    name: res?.data?.name,
    email: res?.data?.email,
    phone: res?.data?.phone,
    isAdmin: res?.data?.isAdmin,
    address: res?.data?.address,
    avatar: res?.data?.avatar
    })
  }
  setIsLoadingUpdate(false)
}

useEffect(()=>{
  form.setFieldsValue(stateUserDetails)
},[form,stateUserDetails])

useEffect(() => {
  if(rowSelected && isOpenDrawer){
    setIsLoadingUpdate(true)
    fetchGetDetailsUser(rowSelected)
  }
}, [rowSelected, isOpenDrawer])


const handleDetailsProduct = () => {
  setIsOpenDrawer(true)
} 

  const {data: dataUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated, isLoading: isLoadingUpdated} = mutationUpdate
  const {data: dataDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted} = mutationDeleted
  const {data: dataDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany} = mutationDeletedMany

  const queryUser = useQuery({queryKey:['users'], queryFn: getAllUsers})
  const {data : users, isLoading: isLoadingUsers} = queryUser
  const renderAction = () => {
    return(
      <div>
      <EditOutlined style={{color:'orange', fontSize:'20px', cursor:'pointer',marginRight:'20px'}} 
      onClick={handleDetailsProduct}/>
      <DeleteOutlined style={{color:'red', fontSize:'20px', cursor:'pointer'}} 
      onClick={() => setIsModalOpenDelete(true)}/>
      </div>
    )
  }

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    // setSearchText(selectedKeys[0]);
    // setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    //setSearchText('');
  };

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters,  }) => (
      <div
        style={{
          padding: 8,
        }}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <InputComponent
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? '#1677ff' : undefined,
        }}
      />
    ),
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    // render: (text) =>
    //   searchedColumn === dataIndex ? (
    //      <Highlighter
    //       highlightStyle={{
    //         backgroundColor: '#ffc069',
    //         padding: 0,
    //       }}
    //       searchWords={[searchText]}
    //       autoEscape
    //       textToHighlight={text ? text.toString() : ''}
    //     />
    //   ) : (
    //     text
    //   ),
    
  });

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      sorter:(a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps('name')
    },

    {
      title: 'Email',
      dataIndex: 'email',
      sorter:(a, b) => a.email.length - b.email.length,
      ...getColumnSearchProps('email')
    },

    {
      title: 'Địa chỉ',
      dataIndex: 'address',
      sorter:(a, b) => a.address.length - b.address.length,
      ...getColumnSearchProps('address')
    },
    
    {
      title: 'Vai trò',
      dataIndex: 'isAdmin',
      filters: [
        {
          text: 'Quản trị viên',
          value: true,
        },
        {
          text: 'Người dùng',
          value: false,
        },
      ],
    },

    {
      title: 'Điện thoại',
      dataIndex: 'phone',
      sorter:(a, b) => a.phone - b.phone,
      ...getColumnSearchProps('phone'),
    },
    {
      title: 'Sửa / Xóa ',
      dataIndex: 'action',
      render: renderAction
    },
  ];
  const dataTable = users?.data?.length && users?.data?.map((user)=>{
    return{
      ...user,key:user._id,
      isAdmin: user.isAdmin ? 'Quản trị viên' : 'Người dùng'
    }
  })


  useEffect(() => {
    if(isSuccessDeleted && dataDeleted?.status === 'OK'){
      message.success()
      handleCancelDelete()
    }
    else if(isErrorDeleted){
      message.error()
    }
  },[isSuccessDeleted])

  useEffect(() => {
    if(isSuccessDeletedMany && dataDeletedMany?.status === 'OK'){
      message.success()
    }
    else if(isErrorDeletedMany){
      message.error()
    }
  },[isSuccessDeletedMany])

  const handleCloserDrawer = () => {
    setIsOpenDrawer(false)
    setStateUserDetails(
      {
        name: '',
        email: '',
        phone: '',
        isAdmin: false,
      })
      form.resetFields()
  };

  useEffect(() => {
    if(isSuccessUpdated && dataUpdated?.status === 'OK'){
      message.success()
      handleCloserDrawer()
    }
    else if(isErrorUpdated){
      message.error()
    }
  },[isSuccessUpdated])

  const handleOnchangeDetails = (e) =>{
    setStateUserDetails({
      ...stateUserDetails,
      [e.target.name]: e.target.value
    })
  }

  const handleOnchangeAvatarDetails = async ({fileList}) =>{
    const file = fileList[0]
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateUserDetails({
      ...stateUserDetails,
      avatar:file.preview
    })
  }

  const onUpdateUser = () =>{
    mutationUpdate.mutate({id: rowSelected, token: user?.access_token, ...stateUserDetails}, {
      onSettled: () => {
        queryUser.refetch()
      }
    })
  }

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false)
  }

  const hanDeleteUser = () => {
    mutationDeleted.mutate({id: rowSelected, token: user?.access_token},{
      onSettled: () =>{
        queryUser.refetch()
      }
    })
  }

  return(
    <div>
      <WrapperHeader style={
        {
          fontSize: '20px', 
          fontWeight:'bolder', 
          color:'#9A3B3B', 
          textAlign:'center', 
          textTransform:'uppercase',
          borderBottom: '2px solid #9A3B3B',
          marginBottom: '30px',
          padding: '10px',
          position: 'relative',
          bottom: '20px'
        }}>Quản lý người dùng</WrapperHeader>
        <div style={{
          marginTop:'20px',
        }}>
          <TableComponent data={dataTable} 
          columns={columns} 
          isLoading={isLoadingUsers}
          handleDeleteMany={handleDeleteManyUser}
          onRow={(record, rowIndex) => {
            return {
              onClick: (event) => {
                setRowSelected(record._id)
              }
            };
          }}/>
        </div>

      <DrawerComponent
      title="Thông tin người dùng" 
      isOpen={isOpenDrawer} 
      onClose={()=>setIsOpenDrawer(false)} 
      width='40%'>
<Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
<Form
      name="basic"
      labelCol={{
        span: 5,
      }}
      wrapperCol={{
        span: 22,
      }}
      style={{
        maxWidth: 600,
      }}
      onFinish={onUpdateUser}
      autoComplete="on"
      form={form}
    >
      <Form.Item
        label="Tên"
        name="name"
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập tên !',
          },
        ]}
      >
        <InputComponent value={stateUserDetails['name']} onChange={handleOnchangeDetails} name="name"/>
      </Form.Item>
  
      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập Email !',
          },
        ]}
      >
        <InputComponent value={stateUserDetails['email']} onChange={handleOnchangeDetails} name="email"/>
      </Form.Item>
  
  <Form.Item
  label="Số điện thoại"
  name="phone"
  rules={[
    {
      required: true,
      message: 'Vui lòng nhập số sao điện thoại !',
    },
  ]}
>
  <InputComponent value={stateUserDetails.phone} onChange={handleOnchangeDetails} name="phone"/>
</Form.Item>

<Form.Item
label="Địa chỉ"
name="address"
rules={[
  {
    required: true,
    message: 'Vui lòng nhập đại chỉ!',
  },
]}
>
<InputComponent value={stateUserDetails.address} onChange={handleOnchangeDetails} name="address"/>
</Form.Item>

<Form.Item
label="Ảnh đại diện"
name="avatar"
rules={[
{
  required: true,
  message: 'Vui lòng chọn hình ảnh đại diện !',
},
]}
>
<WrapperUploadFile onChange={handleOnchangeAvatarDetails} maxCount={1}>
<Button >Chọn ảnh</Button>
{stateUserDetails?.avatar && (
  <img src={stateUserDetails?.avatar} style={{
      height: '60px',
      width: '60px',
      borderRadius: '50%',
      objectFit: 'cover',
      marginLeft: '10px',
  }} alt="avatar"/>
)}
</WrapperUploadFile>
</Form.Item>

  <Form.Item wrapperCol={{offset: 8, span: 16}}>
    <Button type='primary' htmlType="submit">
      Thay đổi
    </Button>
  </Form.Item>
    </Form>
</Loading>
      </DrawerComponent>

      <ModalComponent
      title="Xóa người dùng" 
      forceRender
      open={isModalOpenDelete} 
      onCancel={handleCancelDelete}
      onOk={hanDeleteUser}>
          <div>
            Bạn có muốn xóa tài khoản này không ?
          </div>
    </ModalComponent>
    </div>
  )
}

export default AdminUser