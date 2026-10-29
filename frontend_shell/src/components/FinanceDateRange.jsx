import React from 'react';
import DatePicker, { registerLocale } from 'react-datepicker';
import { zhCN } from 'date-fns/locale/zh-CN';
import { addMonths } from 'date-fns';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import CalendarTodayOutlinedIcon from '@mui/icons-material/CalendarTodayOutlined';
import 'react-datepicker/dist/react-datepicker.css';

const parse = value => value ? new Date(`${value}T00:00:00`) : null;
const format = value => value ? `${value.getFullYear()}-${String(value.getMonth()+1).padStart(2,'0')}-${String(value.getDate()).padStart(2,'0')}` : '';
registerLocale('zh-CN', zhCN);

export default function FinanceDateRange({start, end, onChange, label='日期范围'}) {
  const [error, setError] = React.useState('');
  const handleChange = ([a, b]) => {
    if (a && b && b < a) {
      [a, b] = [b, a];
    }
    if (a && b && b > addMonths(a, 3)) {
      setError('查询时间范围不能超过三个月');
      return;
    }
    setError('');
    onChange(format(a), format(b));
  };
  return <DatePicker
    selectsRange
    startDate={parse(start)}
    endDate={parse(end)}
    maxDate={new Date()}
    onChange={handleChange}
    dateFormat="yyyy-MM-dd"
    locale="zh-CN"
    monthsShown={1}
    placeholderText="请选择开始和结束日期"
    showMonthDropdown
    showYearDropdown
    dropdownMode="select"
    showPopperArrow={false}
    popperPlacement="bottom-start"
    customInput={<TextField aria-label={label} label={label} size="small" error={Boolean(error)} helperText={error} sx={{width:{xs:'100%',sm:280}}} InputProps={{endAdornment:<InputAdornment position="end"><CalendarTodayOutlinedIcon sx={{fontSize:18,color:'#6d8279'}}/></InputAdornment>}} />}
  />;
}
