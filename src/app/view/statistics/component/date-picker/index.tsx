import { DatePicker } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';

const { RangePicker } = DatePicker;

const MyDatePicker: React.FC<RangePickerProps> = ({ value, onChange }) => {
  return (
    <div className="m-20 text-center">
      <span>筛选时间：</span>
      <RangePicker value={value} onChange={onChange} />
    </div>
  );
};

export default MyDatePicker;
