import React, { useState, useEffect } from 'react'
import { getLogs } from '../../services/api-client/logsService';
import { useNavigate } from 'react-router-dom';
import UserTableComponent from '../../table-tabs/UserTableComponent';
import '../../style/Admin.css'

function Logs(props) {
  const [logs, setLogs] = useState([]);
  const navigate = useNavigate();
  if (props.user?.role !== 'admin') {
    navigate('/invalid');
  }

  useEffect(() => {
    getLogs().then((res) => {
      if (res.status === 200) {
        setLogs(res.data)
      }
    }).catch((err) => {
      console.log(err)
    });
  }, [])

  const rows = logs.map((log) => ({
    id: log.id,
    date: log.date.substring(0, 10) + " " + log.date.substring(12, 19) + "UTC",
    user: log.userId,
    action: log.action,
  }));

  const columns = [
    { field: 'id', headerName: 'ID', width: 70 },
    { field: 'date', headerName: 'Date', width: 220 },
    { field: 'user', headerName: 'User', width: 150 },
    { field: 'action', headerName: 'Action', width: 380 },
  ];

  return (
    <div className='main-div'>
      <div className='content-div'>
        <h1>Logs</h1>
        <UserTableComponent rows={rows} columns={columns} />
      </div>
    </div>

  )
}

export default Logs