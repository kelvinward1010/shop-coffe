import React, { useEffect, useRef, useState } from "react";
import { WrapperHeader, WrapperUploadFile } from "./style";
import { Button, Form, Select, Space } from "antd";
import {FileAddOutlined ,EditOutlined,DeleteOutlined,SearchOutlined } from '@ant-design/icons'
import TableComponent from "../TableComponent/TableComponent";
import InputComponent from "../InputComponent/InputComponet";
import { getBase64, renderOptions } from "../../utils";
import * as ProductService from '../../services/ProductServices'
import { useMutationHooks } from "../../hook/useMutationHook";
import * as message from "../../components/Message/Message"
import { useQuery } from "@tanstack/react-query";
import DrawerComponent from "../DrawerComponent/DrawerComponent";
import Loading from "../LoadingComponent/LoadingComponent";
import { useSelector } from "react-redux";
import ModalComponent from "../ModalComponent/ModalComponent";
import ReCharts from "./ReCharts";
import ReCharts2 from "./ReCharts copy";
import ReCharts3 from "./ReCharts copy 2";
import ReCharts4 from "./ReCharts copy 3";


const AdminProduct = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [rowSelected, setRowSelected] = useState('')
  const [isOpenDrawer, setIsOpenDrawer] = useState (false)
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false)
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false)
  const [typeSelect, setTypeSelect] = useState('')
  const user = useSelector((state)=>state?.user)
  const searchInput = useRef(null);
  const initial = () => ({
    name: '',
    price: '',
    description: '',
    rating: '',
    image: '',
    type: '',
    countInStock: '',
    newType: '',
    discount:'',
  })
  const [stateProduct, setStateProduct] = useState(initial())
  const [stateProductDetails, setStateProductDetails] = useState(initial())

  const [form] = Form.useForm()
  
  const mutation = useMutationHooks(
    (data) => {
      const { 
      name,
      price,
      description,
      rating,
      image,
      type,
     countInStock,discount } = data
      const res = ProductService.createProduct({
        name,
        price,
        description,
        rating,
        image,
        type,
        countInStock,
        discount
      })
    return res
    }
  )
  const mutationUpdate = useMutationHooks(
    (data) => {
      const { 
        id,
        token,
        ...rests} = data
      const res = ProductService.updateProduct(
        id,
        token,
        {...rests})
    return res
    }
  )

  const mutationDeleted = useMutationHooks(
    (data) => {
      const { 
      id,
      token} = data
      const res = ProductService.deleteProduct(
        id,
        token)
    return res
    }
  )

  const mutationDeletedMany = useMutationHooks(
    (data) => {
      const { token, ...ids
    } = data
      const res = ProductService.deleteManyProduct(
        ids,
        token)
    return res
    }
  )
 
const getAllProducts = async () =>{
    const res = await ProductService.getAllProduct()
    return res
  }

const fetchGetDetailsProduct = async (rowSelected) => {
  const res = await ProductService.getDetailsProduct(rowSelected) //rowSelected là id
  if(res?.data){
    setStateProductDetails({
    name: res?.data?.name,
    price: res?.data?.price,
    description: res?.data?.description,
    rating: res?.data?.rating,
    image: res?.data?.image,
    type: res?.data?.type,
    countInStock: res?.data?.countInStock,
    discount: res?.data?.discount
    })
  }
  setIsLoadingUpdate(false)
}

useEffect(()=>{
  if(!isModalOpen){
    form.setFieldsValue(stateProductDetails)
  }else{
    form.setFieldsValue( initial())
  }
},[form,stateProductDetails,isModalOpen])

useEffect(() => {
  if(rowSelected && isOpenDrawer){
    setIsLoadingUpdate(true)
    fetchGetDetailsProduct(rowSelected)
  }
}, [rowSelected, isOpenDrawer])


const handleDetailsProduct = () => {
  setIsOpenDrawer(true)
} 

  const handleDeleteManyProduct = (ids) => {
    mutationDeletedMany.mutate({ids: ids, token: user?.access_token},{
      onSettled: () =>{
        queryProduct.refetch()
      }
    })
  }

  const fetchAllTypeProduct = async () => {
    const res = await ProductService.getAllTypeProduct()
    return res
  }

  const {data, isSuccess, isError} = mutation
  const {data: dataUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated, isLoading: isLoadingUpdated} = mutationUpdate
  const {data: dataDeleted, isSuccess: isSuccessDeleted, isError: isErrorDeleted} = mutationDeleted
  const {data: dataDeletedMany, isSuccess: isSuccessDeletedMany, isError: isErrorDeletedMany} = mutationDeletedMany


  const queryProduct = useQuery({queryKey:['products'], queryFn: getAllProducts})
  const typeProduct = useQuery({queryKey:['type-product'], queryFn: fetchAllTypeProduct})
  const {data : products, isLoading: isLoadingProducts} = queryProduct
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
      render: (text) => <a>{text}</a>,
      sorter:(a, b) => a.name.length - b.name.length,
      ...getColumnSearchProps('name')
    },

    {
      title: 'Giá',
      dataIndex: 'price',
      sorter:(a, b) => a.price - b.price,
      filters: [
        {
          text: '>= 50',
          value: '>=',
        },
        {
          text: '=< 50',
          value: '<=',
        },
      ],
      onFilter: (value, record) => {
        if(value === '>='){
          return record.price >= 50
        } 
          return record.price <= 50
      }
    },

    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      sorter:(a, b) => a.rating - b.rating,
      filters: [
        {
          text: '>= 3',
          value: '>=',
        },
        {
          text: '=< 3',
          value: '<=',
        },
      ],
      onFilter: (value, record) => {
        if(value === '>='){
          return Number(record.rating) >= 3
        } 
          return Number(record.rating) <= 3
      }
    },

    {
      title: 'Loại',
      dataIndex: 'type',
    },
    {
      title: 'Sửa / Xóa ',
      dataIndex: 'action',
      render: renderAction
    },
  ];
  
  const dataTable = products?.data?.length && products?.data?.map((product)=>{
    return{
      ...product,key:product._id
    }
  })


  useEffect(() => {
    if(isSuccess && data?.status === 'OK'){
      message.success()
      handleCancel()
    }
    else if(isError){
      message.error()
    }
  },[isSuccess])

  useEffect(() => {
    if(isSuccessDeletedMany && dataDeletedMany?.status === 'OK'){
      message.success()
    }
    else if(isErrorDeletedMany){
      message.error()
    }
  },[isSuccessDeletedMany])

  useEffect(() => {
    if(isSuccessDeleted && dataDeleted?.status === 'OK'){
      message.success()
      handleCancelDelete()
    }
    else if(isErrorDeleted){
      message.error()
    }
  },[isSuccessDeleted])

  const handleCloserDrawer = () => {
    setIsOpenDrawer(false)
    setStateProductDetails(
      {
        name: '',
        price: '',
        description: '',
        rating: '',
        image: '',
        type: '',
        countInStock: '',
      })
      form.resetFields()
  };

  useEffect(() => {
    if(isSuccessUpdated && dataUpdated?.status === 'OK'){
      message.success()
      handleCancel()
    }
    else if(isErrorUpdated){
      message.error()
    }
  },[isSuccessUpdated])

  const handleCancel = () => {
    setIsModalOpen(false)
    setStateProduct(
      {
        name: '',
        price: '',
        description: '',
        rating: '',
        image: '',
        type: '',
        countInStock: '',
        discount: '',
      })
      form.resetFields()
  };

  const onFinish = () => {
    const params = {
      name: stateProduct.name,
      price: stateProduct.price,
      description: stateProduct.description,
      rating: stateProduct.rating,
      image: stateProduct.image,
      type: stateProduct.type === 'add_type' ? stateProduct.newType : stateProduct.type,
      countInStock: stateProduct.countInStock,
      discount: stateProduct.discount
    }
    mutation.mutate(params, {
      onSettled: () => {
        queryProduct.refetch()
      }
    })
  }

  const handleOnchange = (e) =>{
    setStateProduct({
      ...stateProduct,
      [e.target.name]: e.target.value
    })
  }

  const handleOnchangeDetails = (e) =>{
    setStateProductDetails({
      ...stateProductDetails,
      [e.target.name]: e.target.value
    })
  }

  const handleOnchangeAvatar = async ({fileList}) =>{
    const file = fileList[0]
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProduct({
      ...stateProduct,
      image:file.preview
    })
  }

  const handleOnchangeAvatarDetails = async ({fileList}) =>{
    const file = fileList[0]
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }
    setStateProductDetails({
      ...stateProductDetails,
      image:file.preview
    })
  }

  const onUpdateProduct = () =>{
    mutationUpdate.mutate({id: rowSelected, token: user?.access_token, ...stateProductDetails}, {
      onSettled: () => {
        queryProduct.refetch()
      }
    })
  }

  const handleCancelDelete = () => {
    setIsModalOpenDelete(false)
  }

  const hanDeleteProduct = () => {
    mutationDeleted.mutate({id: rowSelected, token: user?.access_token},{
      onSettled: () =>{
        queryProduct.refetch()
      }
    })
  }

  const handleChangeSelect = (value) =>{
      setStateProduct({
        ...stateProduct,
        type: value
      })
  }


  return(
    <div>
      <WrapperHeader style={{
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
      }}>Quản lý sản phẩm</WrapperHeader>
      <div style={{display: 'flex', margin:'50px'}}>
      <div style={{height:'200px', width:'200px'}}>
      <ReCharts4 data={products?.data}/>
      </div>
      <div style={{height:'200px', width:'200px'}}>
      <ReCharts3 data={products?.data}/>
      </div>
      <div style={{height:'200px', width:'200px'}}>
      <ReCharts data={products?.data}/>
      </div>
      <div style={{height:'200px', width:'200px'}}>
      <ReCharts2 data={products?.data}/>
      </div>
      </div>
      <div style={{marginTop:'10px'}}>
      <Button style={{
        height:'fit-content', 
        width:'fit-content',
        borderRadius:'5px',
        color:'rgb(192, 130, 97)',
        background:'rgb(226, 199, 153)',
        position: 'relative',
        right:'-800px',
        textTransform:'uppercase',
        fontWeight: 'bolder',
        boxShadow: '1px 1px 2px #ccc',
      }}
      onClick={() => setIsModalOpen(true)}>
        <FileAddOutlined  style={{
          fontSize: '50px',
        }}/> Thêm sản phẩm
        </Button>
        </div>
        <div style={{
          marginTop:'20px',
        }}>
          <TableComponent 
          data={dataTable} 
          columns={columns} 
          handleDeleteMany={handleDeleteManyProduct}
          onRow={(record, rowIndex) => {
            console.log('record._id',record);
            return {
              onClick: (event) => {
                setRowSelected(record._id)
              }
            };
          }}/>
        </div>

        <ModalComponent
        forceRender
        title="Tạo sản phẩm" 
        open={isModalOpen} 
        onCancel={handleCancel}
        footer={null}
        >
        <Form
        name="basic"
        labelCol={{
          span: 8,
        }}
        wrapperCol={{
          span: 16,
        }}
        style={{
          maxWidth: 600,
        }}
        onFinish={onFinish}
        autoComplete="off"
        form={form}
      >
        <Form.Item
          label="Tên"
          name="name"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập tên sản phẩm !',
            },
          ]}
        >
          <InputComponent value={stateProduct.name} onChange={handleOnchange} name="name"/>
        </Form.Item>
    
        <Form.Item
          label="Loại mặt hàng"
          name="type"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập loại mặt hàng cho sản phẩm !',
            },
          ]}
        >
        <Select
        name = "type"
        //defaultValue="lucy"
        // style={{
        //   width: '100%',
        // }}
        value={stateProduct.type}
        onChange={handleChangeSelect}
        options={renderOptions(typeProduct?.data?.data)}
        />
        </Form.Item>
        {stateProduct.type === 'add_type' && (
          <Form.Item
            label="Loại mặt hàng mới"
            name="newType"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập loại mặt hàng cho sản phẩm !',
              },
            ]}
          >
            <InputComponent value={stateProduct.newType} onChange={handleOnchange} name="newType"/>
          </Form.Item>
        )}

        <Form.Item
        label="Số lương"
        name="countInStock"
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập số lượng cho sản phẩm !',
          },
        ]}
      >
        <InputComponent value={stateProduct.countInStock} onChange={handleOnchange} name="countInStock"/>
      </Form.Item>

      <Form.Item
      label="Giá bán"
      name="price"
      rules={[
        {
          required: true,
          message: 'Vui lòng nhập giá bán cho sản phẩm !',
        },
      ]}
    >
      <InputComponent value={stateProduct.price} onChange={handleOnchange} name="price"/>
    </Form.Item>
    
    <Form.Item
    label="Số sao đánh giá"
    name="rating"
    rules={[
      {
        required: true,
        message: 'Vui lòng nhập số sao đánh giá cho sản phẩm !',
      },
    ]}
  >
    <InputComponent value={stateProduct.rating} onChange={handleOnchange} name="rating"/>
  </Form.Item>

  <Form.Item
  label="Mô tả"
  name="description"
  rules={[
    {
      required: true,
      message: 'Vui lòng nhập mô tả cho sản phẩm !',
    },
  ]}
>
  <InputComponent value={stateProduct.description} onChange={handleOnchange} name="description"/>
</Form.Item>

<Form.Item
label="Giảm giá"
name="discount"
rules={[
  {
    required: true,
    message: 'Vui lòng nhập giảm giá cho sản phẩm !',
  },
]}
>
<InputComponent value={stateProduct.discount} onChange={handleOnchange} name="discount"/>
</Form.Item>

<Form.Item
label="Ảnh"
name="image"
rules={[
  {
    required: true,
    message: 'Vui lòng chọn hình ảnh cho sản phẩm !',
  },
]}
>
<WrapperUploadFile onChange={handleOnchangeAvatar} maxCount={1}>
  <Button >Chọn ảnh</Button>
  {stateProduct?.image && (
    <img src={stateProduct?.image} style={{
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
        OK
      </Button>
    </Form.Item>
      </Form>
      </ModalComponent>

      <DrawerComponent 
      title="Chi tiết sản phẩm" 
      isOpen={isOpenDrawer} 
      onClose={()=>setIsOpenDrawer(false)} 
      width='40%'>
<Loading isLoading={isLoadingUpdate || isLoadingUpdated}>
<Form
      name="basic"
      labelCol={{
        span: 8,
      }}
      wrapperCol={{
        span: 22,
      }}
      style={{
        maxWidth: 600,
      }}
      onFinish={onUpdateProduct}
      autoComplete="on"
      form={form}
    >
      <Form.Item
        label="Tên"
        name="name"
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập tên sản phẩm !',
          },
        ]}
      >
        <InputComponent value={stateProductDetails.name} onChange={handleOnchangeDetails} name="name"/>
      </Form.Item>
  
      <Form.Item
        label="Loại mặt hàng"
        name="type"
        rules={[
          {
            required: true,
            message: 'Vui lòng nhập loại mặt hàng cho sản phẩm !',
          },
        ]}
      >
        <InputComponent value={stateProductDetails.type} onChange={handleOnchangeDetails} name="type"/>
      </Form.Item>

      <Form.Item
      label="Số lương"
      name="countInStock"
      rules={[
        {
          required: true,
          message: 'Vui lòng nhập số lượng cho sản phẩm !',
        },
      ]}
    >
      <InputComponent value={stateProductDetails.countInStock} onChange={handleOnchangeDetails} name="countInStock"/>
    </Form.Item>

    <Form.Item
    label="Giá bán"
    name="price"
    rules={[
      {
        required: true,
        message: 'Vui lòng nhập giá bán cho sản phẩm !',
      },
    ]}
  >
    <InputComponent value={stateProductDetails.price} onChange={handleOnchangeDetails} name="price"/>
  </Form.Item>
  
  <Form.Item
  label="Số sao đánh giá"
  name="rating"
  rules={[
    {
      required: true,
      message: 'Vui lòng nhập số sao đánh giá cho sản phẩm !',
    },
  ]}
>
  <InputComponent value={stateProductDetails.rating} onChange={handleOnchangeDetails} name="rating"/>
</Form.Item>

<Form.Item
label="Mô tả"
name="description"
rules={[
  {
    required: true,
    message: 'Vui lòng nhập mô tả cho sản phẩm !',
  },
]}
>
<InputComponent value={stateProductDetails.description} onChange={handleOnchangeDetails} name="description"/>
</Form.Item>

<Form.Item
label="Giảm giá"
name="discount"
rules={[
  {
    required: true,
    message: 'Vui lòng nhập giảm giá cho sản phẩm !',
  },
]}
>
<InputComponent value={stateProductDetails.discount} onChange={handleOnchangeDetails} name="discount"/>
</Form.Item>

<Form.Item
label="Ảnh"
name="image"
rules={[
{
  required: true,
  message: 'Vui lòng chọn hình ảnh cho sản phẩm !',
},
]}
>
<WrapperUploadFile onChange={handleOnchangeAvatarDetails} maxCount={1}>
<Button >Chọn ảnh</Button>
{stateProductDetails?.image && (
  <img src={stateProductDetails?.image} style={{
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
      title="Xóa sản phẩm" 
      open={isModalOpenDelete} 
      onCancel={handleCancelDelete}
      onOk={hanDeleteProduct}>
          <div>
            Bạn có muốn xóa sản phẩm này không ?
          </div>
    </ModalComponent>
    </div>
  )
}

export default AdminProduct