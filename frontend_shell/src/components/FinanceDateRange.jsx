import React from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box, Stack, Typography } from '@mui/material';

const parse = value => value ? dayjs(value) : null;
const format = value => value?.isValid() ? value.format('YYYY-MM-DD') : '';
const today = dayjs().endOf('day');

export default function FinanceDateRange({ start, end, onChange, label = '日期范围' }) {
  const [error, setError] = React.useState('');
  const startValue = parse(start), endValue = parse(end);
  const notify = (nextStart, nextEnd) => {
    if (nextStart && nextEnd && nextEnd.isBefore(nextStart, 'day')) {
      [nextStart, nextEnd] = [nextEnd, nextStart];
    }
    if (nextStart && nextEnd && nextEnd.diff(nextStart, 'month', true) > 3) {
      setError('查询时间范围不能超过三个月');
      return;
    }
    setError('');
    onChange(format(nextStart), format(nextEnd));
  };
  return <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="zh-cn">
    <Box sx={{ width: { xs: '100%', sm: 420 } }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} alignItems={{ sm: 'center' }}>
        <DatePicker
          label={label}
          value={startValue}
          maxDate={today}
          onChange={value => notify(value, endValue)}
          format="YYYY-MM-DD"
          slotProps={{ textField: { size: 'small', fullWidth: true, error: Boolean(error) } }}
        />
        <Typography color="text.secondary" sx={{ display: { xs: 'none', sm: 'block' } }}>至</Typography>
        <DatePicker
          label="结束日期"
          value={endValue}
          minDate={startValue || undefined}
          maxDate={today}
          onChange={value => notify(startValue, value)}
          format="YYYY-MM-DD"
          slotProps={{ textField: { size: 'small', fullWidth: true, error: Boolean(error) } }}
        />
      </Stack>
      {error && <Typography variant="caption" color="error" sx={{ mt: 0.5, display: 'block' }}>{error}</Typography>}
    </Box>
  </LocalizationProvider>;
}
