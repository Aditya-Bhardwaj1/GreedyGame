import { useState } from "react";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { appActions } from "../../Features/AppListSlice/applistSlice";
import useSearchParams from "../../utils/useSearchParams";
import Loading from "../Loading/Loading";
function processDates(date) {
  date = new Date(date);
  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const monthName = monthNames[monthIndex];
  const year = date.getFullYear();
  return `${day}-${monthName}-${year}`;
}
function processRevenue(val) {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  return formatter.format(val);
}
function processRequests(req) {
  const formatter = new Intl.NumberFormat("en-US");
  return formatter.format(req);
}
function calculateFillRate(req, res) {
  let val = req / (res * 100);
  return val;
}
function formatFillRate(val) {
  const formatter = Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 2,
  });
  return formatter.format(val);
}
function calculateCtr(clicks, impression) {
  let val = clicks / (impression * 100);
  return val;
}
function formatCtr(val) {
  //maximumFractionDigits: 0
  const formatter = Intl.NumberFormat("en-US", {
    style: "percent",
    maximumFractionDigits: 2,
  });
  return formatter.format(val);
}
function setFullParams(params) {
  let temp = { ...params };
  const entries = new URLSearchParams(window.location.search).entries();
  for (const [key, value] of entries) {
    if (!(key in temp)) {
      temp[key] = value;
    }
  }
  return temp;
}
const Table = () => {
  // const [sortby, setSortBy] = useState({ type: "", index: -1 });
  const titles = useSelector((state) => state.report.titles);
  const reports = useSelector((state) => state.report.report);
  const Apps = useSelector((state) => state.appList.appList);
  const loading = useSelector((state) => state.report.loading);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(
    (() => {
      if ("page" in searchParams) {
        return parseInt(searchParams["page"]);
      }
      return 1;
    })()
  );
  const dispatch = useDispatch();
  function processApps(app_id) {
    const val = Apps.find((app) => app.app_id === app_id);
    if (val) {
      return val.app_name;
    }
    return val;
  }
  const theads = {
    clicks: processRequests,
    date: processDates,
    requests: processRequests,
    responses: processRequests,
    impressions: processRequests,
    revenue: processRevenue,
  };
  useEffect(() => {
    dispatch(appActions.getApps());
    if ("page" in searchParams) {
      let p = parseInt(searchParams["page"]);
      setPage(p);
    }
  }, [searchParams, dispatch]);
  function getRows() {
    const active = titles
      .filter((title) => title.active)
      .map((title) => title.value);
    let rows = [];
    for (let i = (page - 1) * 10; i < reports.length && i < page * 10; i++) {
      let report = reports[i];
      let l = [];
      for (let j = 0; j < active.length; j++) {
        let key = active[j];
        if (key in report) {
          // let v = theads[key](report[key]);
          let v = report[key];
          l.push(v);
        } else {
          switch (key) {
            case "app":
              let v = processApps(report["app_id"]);
              l.push(v);
              break;
            case "fill rate":
              // let v1 = fillRate(report["requests"], report["responses"]);
              let v1 = calculateFillRate(
                report["requests"],
                report["responses"]
              );
              l.push(v1);
              break;
            case "CTR":
              // let v2 = ctr(report["clicks"], report["impressions"]);
              let v2 = calculateCtr(report["clicks"], report["impressions"]);
              l.push(v2);
              break;
            default:
              l.push("");
              break;
          }
        }
      }

      if (l.length) {
        rows.push(l);
      }
    }
    // console.log(rows);
    return rows;
  }
  function displayRows() {
    const rows = getRows();

    // apply sorting
    // let id = sortby.index;
    // switch (sortby.type) {
    //   case "date":
    //     break;
    //   case "clicks":
    //     break;
    //   case "requests":
    //     break;
    //   case "responses":
    //     break;
    //   case "impressions":
    //     break;
    //   case "revenue":
    //     break;
    //   case "app":
    //     break;
    //   case "fill rate":
    //     break;
    //   case "CTR":
    //     break;
    //   default:
    //     break;
    // }

    const active = titles
      .filter((title) => title.active)
      .map((title) => title.value);
    let res = [];
    for (let i = 0; i < rows.length; i++) {
      let l = [];
      const row = rows[i];
      for (let j = 0; j < active.length; j++) {
        let key = active[j];
        if (key in theads) {
          let v = theads[key](row[j]);
          l.push(<td>{v}</td>);
        } else {
          switch (key) {
            case "app":
              let v = row[j];
              l.push(<td>{v}</td>);
              break;
            case "fill rate":
              let v1 = formatFillRate(row[j]);
              l.push(<td>{v1}</td>);
              break;
            case "CTR":
              let v2 = formatCtr(row[j]);
              l.push(<td>{v2}</td>);
              break;
            default:
              break;
          }
        }
      }
      if (l.length) {
        res.push(<tr>{l}</tr>);
      }
    }
    return res;
  }
  function getNext() {
    // setPage(page + 1);
    let temp = { ...setFullParams(searchParams), page: page + 1 };
    setSearchParams(temp);
    window.history.pushState(
      {},
      "",
      window.location.pathname + new URLSearchParams(searchParams).toString()
    );
  }
  function getPrev() {
    // setPage(page - 1);
    if (page > 1) {
      let temp = { ...setFullParams(searchParams), page: page - 1 };
      setSearchParams(temp);
      window.history.back();
    }
  }
  return loading ? (
    <Loading />
  ) : (
    <>
      <table className="table table-hover" style={{ background: "inherit" }}>
        <thead>
          <tr>
            {titles
              .filter((title) => title.active)
              .map((title, i) => {
                return (
                  <th key={i} scope="col">
                    {title.value.cap()}
                  </th>
                );
              })}
          </tr>
        </thead>
        <tbody>{displayRows()}</tbody>
      </table>
      <div
        className="w-100 d-flex justify-content-center"
        style={{ borderTop: "2px solid black" }}
      >
        <ul className="pagination" style={{ marginTop: "1em" }}>
          <li className="page-item">
            <button
              className="page-link"
              aria-label="Previous"
              onClick={getPrev}
            >
              <span aria-hidden="true">&laquo;</span>
            </button>
          </li>

          <li className="page-item">
            <button className="page-link">{page}</button>
          </li>
          <li className="page-item">
            <button className="page-link" aria-label="Next" onClick={getNext}>
              <span aria-hidden="true">»</span>
            </button>
          </li>
        </ul>
      </div>
    </>
  );
};
export default Table;
