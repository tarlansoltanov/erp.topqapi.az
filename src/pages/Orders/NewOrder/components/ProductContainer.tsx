import React, { useState } from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";

// Reactstrap
import { Row, Col, Card, CardBody, Button, Table } from "reactstrap";

// Components
import VerifyModal from "@/components/VerifyModal";

// Types
import { OrderCartItem } from "@/types/models";

// Actions
import { createOrderCartItem, updateOrderCartItem, deleteOrderCartItem } from "@/store/actions";

// Related Components
import ProductModal from "./ProductModal";

const ProductContainer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { items, status } = useSelector((state: RootState) => state.orderCart);

  // Product Modal
  const [item, setItem] = useState<OrderCartItem | null>(null);
  const [productModal, setProductModal] = useState<boolean>(false);

  const onCreate = () => {
    setItem(null);
    setProductModal(true);
  };

  const onUpdate = (data: OrderCartItem) => {
    setItem(data);
    setProductModal(true);
  };

  const handleSubmit = (formData: FormData) => {
    if (item) {
      // Update
      dispatch(updateOrderCartItem({ id: item.id, data: formData }));
    } else {
      // Create
      dispatch(createOrderCartItem(formData));
    }
  };

  // Delete Modal
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const onDelete = (data: OrderCartItem) => {
    setItem(data);
    setDeleteModal(true);
  };

  const handleDelete = () => {
    if (item) dispatch(deleteOrderCartItem(item.id));
    setDeleteModal(false);
  };

  if (!items) {
    if (status.loading) return <h1 className="text-center mt-5">Loading...</h1>;
    return <h1>Not found</h1>;
  }

  return (
    <React.Fragment>
      <Col xl="12">
        <Card>
          <CardBody>
            <div className="table-responsive">
              <Table className="table align-middle mb-0 table-nowrap">
                <thead className="table-light">
                  <tr>
                    <th>Məhsul</th>
                    <th>Ölçü</th>
                    <th>Firma</th>
                    <th>Qiymət</th>
                    <th>Miqdar</th>
                    <th colSpan={2}>Cəm</th>
                  </tr>
                </thead>

                <tbody>
                  {items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <h5 className="font-size-14 text-truncate">
                          <span className="text-dark">{item.product.name}</span>
                        </h5>
                        <p className="mb-0">{`Kateqoriya: ${item.product.category.name}`}</p>
                      </td>
                      <td>{item.size}</td>
                      <td>{item.supplier.name}</td>
                      <td>{item.price} AZN</td>
                      <td>{item.quantity}</td>
                      <td>{Number(item.price) * Number(item.quantity)} AZN</td>
                      <td>
                        <div className="d-flex gap-3">
                          {onUpdate && (
                            <a
                              role="button"
                              className="action-icon text-success"
                              onClick={() => onUpdate(item)}>
                              <i className="mdi mdi-pencil font-size-18" />
                            </a>
                          )}

                          {onDelete && (
                            <a
                              role="button"
                              className="action-icon text-danger"
                              onClick={() => onDelete(item)}>
                              <i className="mdi mdi-trash-can font-size-18" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            <Row className="mt-4">
              <Col sm="6">
                <div className="text-sm-end mt-2 mt-sm-0">
                  <Button color="primary" className="mb-2 me-2" onClick={onCreate}>
                    <i className={`mdi mdi-plus-circle-outline me-1`} />
                    Əlavə et
                  </Button>
                </div>
              </Col>
            </Row>
          </CardBody>
        </Card>
      </Col>

      {/* Render Product Modal */}
      {productModal && (
        <ProductModal
          data={item}
          show={productModal}
          isEdit={item !== null}
          toggle={() => setProductModal(false)}
          handleSubmit={handleSubmit}
        />
      )}

      {/* Render Delete Modal */}
      {deleteModal && (
        <VerifyModal
          status={status}
          show={deleteModal}
          onVerify={handleDelete}
          action={deleteOrderCartItem.typePrefix}
          onClose={() => setDeleteModal(false)}
          message="Seçilmiş məhsulu silmək istədiyinizə əminsiniz?"
        />
      )}
    </React.Fragment>
  );
};

export default ProductContainer;
