import React, { useState } from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";

// Reactstrap
import { Container } from "reactstrap";

// Components
import Breadcrumbs from "@/components/Breadcrumb";
import VerifyModal from "@/components/VerifyModal";

// Helpers
import { getPageTitle } from "@/helpers";

// Types
import { FactoryProduct } from "@/types/models";

// Actions
import { createFactoryProduct, updateFactoryProduct, deleteFactoryProduct } from "@/store/actions";

// Related components
import TableContainer from "./components/TableContainer";
import FormModal from "./components/FormModal";

const FactoryProducts = () => {
  const title = "Məhsullar";

  document.title = getPageTitle(title);

  const dispatch = useDispatch<AppDispatch>();
  const { status } = useSelector((state: RootState) => state.factoryProduct);

  // Selected item
  const [item, setItem] = useState<FactoryProduct | null>(null);

  // Form Modal
  const [formModal, setFormModal] = useState<boolean>(false);

  const onCreate = () => {
    setItem(null);
    setFormModal(true);
  };

  const onUpdate = (data: FactoryProduct) => {
    setItem(data);
    setFormModal(true);
  };

  const handleSubmit = (formData: FormData) => {
    if (item !== null) {
      dispatch(updateFactoryProduct({ id: item!.id, data: formData }));
    } else {
      dispatch(createFactoryProduct(formData));
    }
  };

  // Delete Modal
  const [deleteModal, setDeleteModal] = useState<boolean>(false);

  const onDelete = (data: FactoryProduct) => {
    setItem(data);
    setDeleteModal(true);
  };

  const handleDelete = () => {
    if (item) dispatch(deleteFactoryProduct(item.id));
    setDeleteModal(false);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title={title}
            breadcrumbItems={[
              { title: "Ana Səhifə", url: "/" },
              { title: "İstehsalat", url: "/factory" },
              { title: title },
            ]}
          />

          {/* Render Table Container */}
          <TableContainer onCreate={onCreate} onUpdate={onUpdate} onDelete={onDelete} />

          {/* Render Form Modal */}
          {formModal && (
            <FormModal
              data={item}
              show={formModal}
              isEdit={item !== null}
              toggle={() => setFormModal(false)}
              handleSubmit={handleSubmit}
            />
          )}

          {/* Render Delete Modal */}
          {deleteModal && (
            <VerifyModal
              status={status}
              show={deleteModal}
              onVerify={handleDelete}
              action={deleteFactoryProduct.typePrefix}
              onClose={() => setDeleteModal(false)}
              message="Seçilmiş məlumatı silmək istədiyinizə əminsiniz?"
            />
          )}
        </Container>
      </div>
    </React.Fragment>
  );
};

export default FactoryProducts;
