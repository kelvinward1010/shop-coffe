import { Table } from "antd";
import React, { useState } from "react";
import Loading from "../LoadingComponent/LoadingComponent";
import { Excel } from "antd-table-saveas-excel";
import { useMemo } from "react";

const TableComponent = (props) =>{
  const {selectionType = 'checkbox', data:dataSource =[] , columns = [], isLoading= false, handleDeleteMany} = props
  const [rowSelectedKeys, setRowSelectedKeys] = useState([])
  const newColumnExport = useMemo(()=>{
    const arr = columns?.filter((col) => col.dataIndex !== 'action')
    return arr
  }, [columns])
  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setRowSelectedKeys(selectedRowKeys)
    },
    // getCheckboxProps: (record) => ({
    //   disabled: record.name === 'Disabled User',
    //   // Column configuration not to be checked
    //   name: record.name,
    // }),
  };
  const items = [
    // {
    //   key: '1',
    //   label: (
    //     <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
    //       1st menu item
    //     </a>
    //   ),
    // },
    // {
    //   key: '2',
    //   label: (
    //     <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
    //       2nd menu item (disabled)
    //     </a>
    //   ),
    //   disabled: true,
    // },
    // {
    //   key: '3',
    //   label: (
    //     <a target="_blank" rel="noopener noreferrer" href="https://www.luohanacademy.com">
    //       3rd menu item (disabled)
    //     </a>
    //   ),
    //   disabled: true,
    // },
    // {
    //   key: '4',
    //   danger: true,
    //   label: 'a danger item',
    // },
  ]

  const handleDeleteAll = () =>{
    handleDeleteMany(rowSelectedKeys)
  }

  const exportExcel = () => {
    const excel = new Excel();
    excel
      .addSheet("test")
      .addColumns(newColumnExport)
      .addDataSource(dataSource, {
        str2Percent: true
      })
      .saveAs("Excel.xlsx");
  };

  return(
    <div style={{background:'#F2ECBE', padding:'15px',borderRadius:'5px'}}>
    <Loading isLoading={isLoading}>
    {rowSelectedKeys.length > 0 && (
      <div style={{
        padding: '10px', 
        marginBottom:'20px', 
        background:'#9A3B3B', 
        color: 'white', 
        border:'1px solid #9A3B3B',
        borderRadius: '5px',
        cursor: 'pointer',
        width: 'fit-content',
        boxShadow: '1px 1px 2px #ccc',

      }} onClick={handleDeleteAll}> 
      Xóa dữ liệu được đánh dấu
    </div>
    )}
      <button onClick={exportExcel} style={
        {padding: '10px', 
        marginBottom:'40px', 
        background:'#C08261', 
        color: 'white', 
        border:'1px solid #9A3B3B',
        borderRadius: '5px',
        cursor: 'pointer',
        boxShadow: '1px 1px 2px #ccc',

      }}>Xuất ra file excel</button>
    <Table
    style={{
      border:'1px solid #9A3B3B',
      boxShadow: '1px 1px 2px #ccc',

    }}
      rowSelection={{
        type: selectionType,
        ...rowSelection,
      }}
      columns={columns}
      dataSource={dataSource}
      {...props}
    />
    </Loading>    
  </div>
  )
}

export default TableComponent