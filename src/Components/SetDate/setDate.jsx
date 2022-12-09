import { useEffect } from "react";
import DatePicker from "react-date-picker";
import { useDispatch } from "react-redux";
import { reportActions } from "../../Features/ReportSlice/reportSlice";
import useEndDate from "../../utils/useEndDate";
import useInitialDate from "../../utils/useInitialDate";
const SetDate = () => {
  const [startDate, setStartDate] = useInitialDate();
  const [endDate, setEndDate] = useEndDate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(reportActions.getReports());
  }, [startDate, endDate, dispatch]);
  return (
    <>
      <DatePicker
        selected={startDate}
        onChange={(date) => setStartDate(date)}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        value={startDate}
      />
      <DatePicker
        selected={endDate}
        onChange={(date) => setEndDate(date)}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        value={endDate}
      />
    </>
  );
};
export default SetDate;
