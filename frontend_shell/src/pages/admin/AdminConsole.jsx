import * as React from 'react';
import { Alert, Box, Button, Grid, Paper, Stack, TextField, Typography } from '@mui/material';
import { API } from '../../App';

const mb = bytes => `${(Number(bytes || 0) / 1024 / 1024).toFixed(2)} MB`;
const yesterday = () => { const d = new Date(); d.setDate(d.getDate() - 1); return d.toISOString().slice(0, 10); };

export default function AdminConsole() {
  const [metrics, setMetrics] = React.useState(null);
  const [start, setStart] = React.useState(yesterday());
  const [end, setEnd] = React.useState(yesterday());
  const [message, setMessage] = React.useState('');
  const [error, setError] = React.useState('');
  const load = React.useCallback(() => fetch(`${API}/api/admin/metrics`, { credentials: 'include' }).then(r => r.ok ? r.json() : r.json().then(x => Promise.reject(new Error(x.error || '加载失败')))).then(setMetrics).catch(e => setError(e.message)), []);
  React.useEffect(() => { load(); }, [load]);
  const remove = async () => {
    setMessage(''); setError('');
    if (!start || !end || start > end) return setError('请选择有效的日期范围');
    if (!window.confirm(`确认删除 ${start} 至 ${end} 的全部业务数据吗？此操作只删除数据记录，不删除表结构。`)) return;
    const r = await fetch(`${API}/api/admin/delete-data`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ start_date: start, end_date: end }) });
    const data = await r.json();
    if (!r.ok) return setError(data.error || '删除失败');
    setMessage(`已删除 ${data.deleted} 条数据`); setMetrics(data.metrics);
  };
  return <><Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>后台中控</Typography><Typography color="text.secondary" sx={{ mb: 2 }}>仅管理员可查看和清理系统数据</Typography><Grid container spacing={2} sx={{ mb: 2 }}>{[['数据库占用', metrics ? mb(metrics.database_bytes) : '加载中…'], ['上传文件占用', '未保存原文件'], ['数据条数', metrics?.row_count ?? '加载中…'], ['数据日期', metrics?.start_date ? `${metrics.start_date} 至 ${metrics.end_date}` : '暂无数据']].map(([label, value]) => <Grid key={label} size={{ xs: 12, sm: 6, lg: 3 }}><Paper sx={{ p: 2, height: '100%' }}><Typography color="text.secondary">{label}</Typography><Typography variant="h6" fontWeight={700} sx={{ mt: 1 }}>{value}</Typography></Paper></Grid>)}</Grid><Paper sx={{ p: { xs: 2, sm: 3 } }}><Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>删除业务数据</Typography><Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>仅删除选中日期范围内的数据记录，数据库表结构和账号信息不会删除。</Typography><Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} alignItems={{ sm: 'center' }}><TextField label="开始日期" type="date" value={start} onChange={e => setStart(e.target.value)} size="small" InputLabelProps={{ shrink: true }} /><TextField label="结束日期" type="date" value={end} onChange={e => setEnd(e.target.value)} size="small" InputLabelProps={{ shrink: true }} /><Button color="error" variant="contained" onClick={remove}>删除选中数据</Button><Button variant="outlined" onClick={load}>刷新状态</Button></Stack>{message && <Alert severity="success" sx={{ mt: 2 }}>{message}</Alert>}{error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}</Paper></>;
}
