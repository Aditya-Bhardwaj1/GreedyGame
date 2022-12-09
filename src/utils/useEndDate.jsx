import { useEffect } from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { reportActions } from "../Features/ReportSlice/reportSlice";
import useSearchParams from "./useSearchParams";
function formatDate(date) {
  let day = date.getDate();
  if (day < 10) {
    day = "0" + day;
  }
  let month = date.getMonth() + 1;
  if (month < 10) {
    month = "0" + month;
  }
  let year = date.getFullYear();
  return `${year}-${month}-${day}`;
}
const useEndDate = () => {
  const eDate = useSelector((state) => state.report.endDate);
  const [endDate, setEndDate] = useState(new Date(eDate));
  const [params, setParams] = useSearchParams();
  const dispatch = useDispatch();
  useEffect(() => {
    if ("endDate" in params) {
      dispatch(reportActions.updateEndDate(params["endDate"]));
    }
  }, [params]);
  useEffect(() => {
    setEndDate(new Date(eDate));
  }, [eDate]);
  function updateEndDate(newdateobj) {
    let sParams = new URLSearchParams(window.location.search);
    const entries = sParams.entries();
    let temp = { ...params };
    for (const [key, value] of entries) {
      if (!(key in temp)) {
        temp[key] = value;
      }
    }
    temp = { ...temp, endDate: formatDate(newdateobj) };
    setParams(temp);
  }
  return [endDate, updateEndDate];
};
export default useEndDate;
