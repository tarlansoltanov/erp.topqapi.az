import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";

// Reactstrap
import { Row, Col, Card, CardBody } from "reactstrap";

// React Table
import { createColumnHelper } from "@tanstack/react-table";

// Components
import DataTable from "@/components/DataTable";
import * as Fields from "@/components/DataTable/Fields";
import * as Filters from "@/components/DataTable/Filters";
import {
  useSorting,
  usePagination,
  useColumnFiltering,
} from "@/components/DataTable/Hooks";

// Constants
import { ORDER_STATUS, ORDER_STATUS_LABELS, USER_ROLES } from "@/constants";

// Types
import { Order, OrderStats } from "@/types/models";

// Actions
import { getOrders } from "@/store/actions";
import { getOrderStats } from "@/api/order";

interface Props {
  branchID: number | null;
}

const TableContainer = ({ branchID }: Props) => {
  const { user } = useSelector((state: RootState) => state.account);

  // Pagination
  const { page, limit, pagination, onPaginationChange } = usePagination();

  // Sorting
  const { ordering, sorting, onSortingChange } = useSorting();

  // Column Filtering
  const { filters, columnFilters, onColumnFiltersChange } =
    useColumnFiltering();

  // Table data
  const dispatch = useDispatch<AppDispatch>();
  const { update, items, status, count } = useSelector(
    (state: RootState) => state.order
  );

  const [stats, setStats] = useState<OrderStats | null>(null);

  const fetchItems = () => {
    dispatch(
      getOrders({ ...filters, page, limit, ordering, branch_id: branchID })
    );
    getOrderStats({ ...filters, branch_id: branchID })
      .then((response) => {
        setStats(response);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchItems();
  }, [columnFilters, pagination, sorting, branchID]);

  useEffect(() => {
    if (update) fetchItems();
  }, [update]);

  // Columns
  const columnHelper = createColumnHelper<Order>();

  const columns = [
    columnHelper.display({
      header: "#",
      enableSorting: false,
      cell: (cell) => {
        return <Fields.IndexField cell={cell} />;
      },
    }),
    columnHelper.accessor("id", {
      header: "Satış Kodu",
      cell: (cell) => {
        return (
          <Fields.LinkField
            text={`#${cell.getValue()}`}
            url={`/orders/${cell.getValue()}`}
          />
        );
      },
      meta: {
        filterComponent: (column) => <Filters.TextFilter column={column} />,
      },
      footer: () => {
        return <Fields.NumberField value={stats?.total_orders || 0} />;
      },
    }),
    columnHelper.accessor("status", {
      header: "status",
      cell: (cell) => {
        const status = ORDER_STATUS_LABELS[cell.getValue()];
        return <Fields.TagField value={status.label} color={status.color} />;
      },
      meta: {
        filterComponent: (column) => (
          <Filters.SelectFilter
            column={column}
            options={Object.keys(ORDER_STATUS_LABELS).map((key) => ({
              value: key,
              label: ORDER_STATUS_LABELS[Number(key)].label,
            }))}
          />
        ),
      },
    }),
    columnHelper.accessor("customer", {
      header: "Müştəri",
      cell: (cell) => {
        return <Fields.TextField text={cell.getValue()} />;
      },
      meta: {
        filterComponent: (column) => <Filters.TextFilter column={column} />,
      },
    }),
    columnHelper.accessor("phone", {
      header: "Telefon",
      enableHiding: true,
      cell: (cell) => {
        return <Fields.TextField text={cell.getValue()} />;
      },
      meta: {
        filterComponent: (column) => <Filters.TextFilter column={column} />,
      },
    }),
    columnHelper.accessor("branch", {
      header: "Filial",
      cell: (cell) => {
        if (user?.type === USER_ROLES.STORE) return null;
        return <Fields.TextField text={cell.getValue().name} />;
      },
      meta: {
        filterComponent: (column) => <Filters.TextFilter column={column} />,
      },
    }),
    columnHelper.accessor("seller", {
      header: "Satıcı",
      cell: (cell) => {
        return <Fields.TextField text={cell.getValue().name} />;
      },
      meta: {
        filterComponent: (column) => <Filters.TextFilter column={column} />,
      },
    }),
    columnHelper.accessor("sale_date", {
      header: "Satış Tarixi",
      cell: (cell) => {
        return <Fields.DateField value={cell.getValue()} />;
      },
      meta: {
        filterComponent: (column) => (
          <Filters.DateRangeFilter column={column} />
        ),
      },
    }),
    columnHelper.accessor("worker", {
      header: "Usta",
      cell: (cell) => {
        if (user?.type === USER_ROLES.STORE) return null;
        return <Fields.TextField text={cell.getValue()?.name} />;
      },
      meta: {
        filterComponent: (column) => <Filters.TextFilter column={column} />,
      },
    }),
    columnHelper.accessor("install_date", {
      header: "Quraşdırılma Tarixi",
      cell: (cell) => {
        if (user?.type === USER_ROLES.STORE) return null;
        return <Fields.DateField value={cell.getValue()} />;
      },
      meta: {
        filterComponent: (column) => (
          <Filters.DateRangeFilter column={column} />
        ),
      },
    }),
    columnHelper.accessor("total_price", {
      header: "Yekun Məbləğ",
      cell: (cell) => {
        return <Fields.PriceField amount={cell.getValue()} />;
      },
      footer: () => {
        if (user?.type === USER_ROLES.STORE) return null;
        return <Fields.PriceField amount={stats?.total_amount || 0} />;
      },
    }),
    columnHelper.accessor("payed", {
      header: "Qalıq Məbləğ",
      cell: (cell) => {
        const total_price = cell.row.original.total_price;
        return <Fields.PriceField amount={total_price - cell.getValue()} />;
      },
      footer: () => {
        if (user?.type === USER_ROLES.STORE) return null;
        return (
          <Fields.PriceField
            amount={(stats?.total_amount || 0) - (stats?.total_payed || 0)}
          />
        );
      },
    }),
    columnHelper.accessor("profit", {
      header: "Gəlir",
      cell: (cell) => {
        if (user?.type === USER_ROLES.STORE) return null;
        const status = cell.row.original.status;
        if (status < ORDER_STATUS.READY) return null;
        return <Fields.PriceField amount={cell.getValue()} />;
      },
      footer: () => {
        if (user?.type === USER_ROLES.STORE) return null;
        return <Fields.PriceField amount={stats?.total_profit || 0} />;
      },
    }),
    columnHelper.display({
      header: "Əməliyyatlar",
      enableSorting: false,
      cell: (cell) => {
        return (
          <Fields.Actions
            data={cell.row.original}
            onView={`/orders/${cell.row.original.id}`}
          />
        );
      },
    }),
  ];

  const columnVisibility = {
    branch: user?.type !== USER_ROLES.STORE && branchID === null,
    worker: user?.type !== USER_ROLES.STORE,
    install_date: user?.type !== USER_ROLES.STORE,
    profit: user?.type !== USER_ROLES.STORE,
  };

  return (
    <Row>
      <Col xs="12">
        <Card>
          <CardBody>
            <DataTable
              data={items || []}
              state={{ columnVisibility }}
              columns={columns}
              controls={
                <Link to="/orders/new" className="btn btn-primary mb-2 me-2">
                  <i className={`mdi mdi-plus-circle-outline me-1`} />
                  Yeni Satış
                </Link>
              }
              loading={
                status.loading && status.lastAction === getOrders.typePrefix
              }
              // Pagination
              pagination={pagination}
              onPaginationChange={onPaginationChange}
              pageCount={Math.ceil(count / limit)}
              // Sorting
              sorting={sorting}
              onSortingChange={onSortingChange}
              // Filtering
              columnFilters={columnFilters}
              onColumnFiltersChange={onColumnFiltersChange}
            />
          </CardBody>
        </Card>
      </Col>
    </Row>
  );
};

export default TableContainer;
