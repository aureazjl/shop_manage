import * as React from 'react';
import { Box, Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody, TextField, Stack, MenuItem, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { API } from '../../App';
import FinanceDateRange from '../../components/FinanceDateRange';

const money = v => new Intl.NumberFormat('zh-CN', { style: 'currency', currency: 'CNY', maximumFractionDigits: 0 }).format(v || 0).replace('CN¥', '¥');
const opts = (rows, key) => [...new Set(rows.map(r => r[key]).filter(Boolean))].sort();

export default function ProfitTable() {
  const [rows, setRows] = React.useState([]);
  const [start, setStart] = React.useState('');
  const [end, setEnd] = React.useState('');
  const [department, setDepartment] = React.useState('');
  const [manager, setManager] = React.useState('');
  const [product, setProduct] = React.useState('');
  const mobile = useMediaQuery(useTheme().breakpoints.down('sm'));

  React.useEffect(() => {
    fetch(API + '/api/profit-rows', { credentials: 'include' })
      .then(r => r.json())
      .then(x => setRows(x.rows || []));
  }, []);

  const filtered = rows.filter(r =>
    (!start || r.stat_date >= start) &&
    (!end || r.stat_date <= end) &&
    (!department || r.department === department) &&
    (!manager || r.manager === manager) &&
    (!product || r.product_name === product)
  );
  const grouped = filtered.reduce((groups, row) => {
    const key = row.department || '未分配部门';
    (groups[key] ||= []).push(row);
    return groups;
  }, {});
  const managerRows = rows.filter(r => !department || r.department === department);
  const productRows = managerRows.filter(r => !manager || r.manager === manager);

  return <>
    <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>利润表</Typography>
    <Paper sx={{ p: 2, mb: 2 }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} flexWrap="wrap" gap={1.5}>
        <FinanceDateRange start={start} end={end} onChange={(a, b) => { setStart(a); setEnd(b); }} />
        <TextField select size="small" label="部门" value={department} onChange={e => { setDepartment(e.target.value); setManager(''); setProduct(''); }}>
          <MenuItem value="">全部部门</MenuItem>{opts(rows, 'department').map(x => <MenuItem key={x} value={x}>{x}</MenuItem>)}
        </TextField>
        <TextField select size="small" label="主管" value={manager} onChange={e => { setManager(e.target.value); setProduct(''); }} disabled={!department}>
          <MenuItem value="">全部主管</MenuItem>{opts(managerRows, 'manager').map(x => <MenuItem key={x} value={x}>{x}</MenuItem>)}
        </TextField>
        <TextField select size="small" label="产品" value={product} onChange={e => setProduct(e.target.value)} disabled={!department}>
          <MenuItem value="">全部产品</MenuItem>{opts(productRows, 'product_name').map(x => <MenuItem key={x} value={x}>{x}</MenuItem>)}
        </TextField>
      </Stack>
    </Paper>
    {mobile ? <Stack spacing={1.5}>
      {Object.entries(grouped).map(([departmentName, departmentRows]) => <Box key={departmentName}>
        <Paper sx={{ p: 1.5 }}>
          <Typography variant="body1" fontWeight={800} color="primary.dark" sx={{ mb: 0.75 }}>{departmentName}</Typography>
          <Stack divider={<Box sx={{ borderBottom: '1px solid', borderColor: 'divider' }} />}>
            {departmentRows.map((r, i) => <Box key={`${departmentName}-${i}`} sx={{ py: 1 }}>
              <Stack direction="row" justifyContent="space-between" gap={1}>
                <Typography variant="body2" fontWeight={700} noWrap sx={{ minWidth: 0 }}>{r.product_name}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0 }}>{r.stat_date}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" gap={1} sx={{ mt: 0.45 }}>
                <Typography variant="caption" color="text.secondary" noWrap>主管：{r.manager || '—'}　推广组长：{r.promotion_leader || '—'}</Typography>
                <Typography variant="caption" fontWeight={700} color={r.profit < 0 ? 'error.main' : 'primary.main'} sx={{ flexShrink: 0 }}>利润 {money(r.profit)}</Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary">销售额 {money(r.actual_sales)}</Typography>
            </Box>)}
          </Stack>
        </Paper>
      </Box>)}
    </Stack> : <Paper sx={{ overflow: 'auto' }}>
      <Table size="small" sx={{ minWidth: 1000 }}>
        <TableHead><TableRow>{['日期', '部门', '主管', '推广组长', '产品名称', '真实销售额', '运营成本', '货品成本', '其他费用', '利润'].map(x => <TableCell key={x}>{x}</TableCell>)}</TableRow></TableHead>
        <TableBody>{filtered.map((r, i) => <TableRow key={i} hover>{[r.stat_date, r.department || '—', r.manager || '—', r.promotion_leader || '—', r.product_name, money(r.actual_sales), money(r.operating_cost), money(r.goods_cost), money(r.other_fee), money(r.profit)].map((x, j) => <TableCell key={j}>{x}</TableCell>)}</TableRow>)}</TableBody>
      </Table>
    </Paper>}
  </>;
}
