import React from "react";
import { BsArrowDownShort, BsArrowUpShort } from "react-icons/bs";
import { useFilters, useGlobalFilter, useSortBy, useTable } from "react-table";
import style from "./table.module.scss";
import { strictValidArrayWithLength } from "../../../utils/common";

function Table(props) {
  const {
    columns,
    data,
    loading,
    tableTitle,
    tableHeader
  } = props;
  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    useTable(
      {
        columns,
        data,
      },
      useFilters,
      useGlobalFilter,
      useSortBy
    );
  return (
    <div className={style.tableContainer}>
      {tableTitle && (
        <div>
          <label>{tableTitle}</label>
        </div>
      )}
      {tableHeader}
      <table {...getTableProps()}>
        {loading && <div className={style.loader}>Loading...</div>}
        <thead className={style["table-header"]}>
          {headerGroups.map((headerGroup) => {
            const { key: headerGroupKey, ...restHeaderGroupProps } = headerGroup.getHeaderGroupProps();
            return (
              <tr key={headerGroupKey} {...restHeaderGroupProps}>
                {headerGroup.headers.map((column) => {
                  const { key: colKey, ...restColProps } = column.getHeaderProps(column.getSortByToggleProps());
                  return (
                    <th
                      key={colKey}
                      {...restColProps}
                      className={style["title"]}
                    >
                      {column.render("Header")}
                  {column.isSorted && (
                    <span>
                      {column.isSortedDesc && (
                        <BsArrowDownShort color="#10044a" size={15} />
                      )}
                      {!column.isSortedDesc && (
                        <BsArrowUpShort color="#10044a" size={15} />
                      )}
                    </span>
                  )}
                </th>
                  );
                })}
              </tr>
            );
          })}
        </thead>
        {strictValidArrayWithLength(data) && (
          <tbody {...getTableBodyProps()} className={style["table-body"]}>
            {rows.map((row) => {
              prepareRow(row);
              const { key: rowKey, ...restRowProps } = row.getRowProps();
              return (
                <tr key={rowKey} {...restRowProps} className={style["data-row"]}>
                  {row.cells.map((cell) => {
                    const { key: cellKey, ...restCellProps } = cell.getCellProps();
                    return (
                      <td key={cellKey} {...restCellProps} className={style["data"]}>
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        )}
      </table>
      {!strictValidArrayWithLength(data) && !loading && (
        <div className={style["blank-data-tag"]}>No data found</div>
      )}
    </div>
  );
}

export default Table;
