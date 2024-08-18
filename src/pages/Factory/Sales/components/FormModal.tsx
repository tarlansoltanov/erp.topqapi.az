import { useEffect, useState } from "react";

// Redux
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";

// Reactstrap
import {
  Modal,
  ModalHeader,
  ModalBody,
  Form,
  Row,
  Col,
  Label,
  Input,
  FormFeedback,
  Alert,
  Spinner,
  Button,
} from "reactstrap";

// React Select
import Select from "react-select";

// Yup and Formik for validation
import * as Yup from "yup";
import { useFormik } from "formik";

// Helpers
import { getOptions, getSelectStyle } from "@/helpers";

// Types
import { Option } from "@/types/option";

// Actions
import {
  getFactoryProducts,
  createFactorySale,
  updateFactorySale,
} from "@/store/actions";

interface Props {
  data: any;
  show: boolean;
  isEdit: boolean;
  toggle: () => void;
  handleSubmit: (formData: any) => void;
}

const FormModal = ({ data, show, isEdit, toggle, handleSubmit }: Props) => {
  const title = isEdit ? "Satış məlumatlarını redaktə et" : "Satış əlavə Et";

  const dispatch = useDispatch<AppDispatch>();

  const { status, errors } = useSelector(
    (state: RootState) => state.factorySale
  );

  const [alertError, setAlertError] = useState<string>("");

  // Validation
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      product: (data && data.product && data.product.id) || "",
      price: (data && data.price) || "",
      quantity: (data && data.quantity) || "",
      date: (data && data.date) || new Date().toISOString().split("T")[0],
    },

    validationSchema: Yup.object({
      product: Yup.number().required("Zəhmət olmasa məhsul seçin!"),
      price: Yup.number()
        .required("Zəhmət olmasa qiymət daxil edin!")
        .min(0, "Qiymət 0 vəya 0-dan böyük olmalıdır!"),
      quantity: Yup.number()
        .required("Zəhmət olmasa miqdar daxil edin!")
        .min(1, "Miqdar 0-dan böyük olmalıdır!"),
      date: Yup.string().required("Zəhmət olmasa tarix daxil edin!"),
    }),

    onSubmit: (values) => {
      const formData = new FormData();

      // Product
      if (!data || values["product"] !== data["product"])
        formData.append("product", values["product"]);

      // Price
      if (!data || values["price"] !== data["price"])
        formData.append("price", values["price"]);

      // Quantity
      if (!data || values["quantity"] !== data["quantity"])
        formData.append("quantity", values["quantity"]);

      // Date
      if (!data || values["date"] !== data["date"])
        formData.append("date", values["date"]);

      handleSubmit(formData);
    },
  });

  // Prodcut Options
  const { items: products } = useSelector(
    (state: RootState) => state.factoryProduct
  );

  const [productName, setProductName] = useState<string>("");
  const [productOptions, setProductOptions] = useState<Option[]>([]);

  useEffect(() => {
    dispatch(getFactoryProducts({ name: productName }));
  }, [productName]);

  useEffect(() => {
    setProductOptions(getOptions(products));
  }, [products]);

  useEffect(() => {
    if (data && data.product) setProductName(data.product.name);
  }, [data]);

  // Success
  useEffect(() => {
    if (show && status) {
      if (
        ((isEdit && status.lastAction === updateFactorySale.typePrefix) ||
          (!isEdit && status.lastAction === createFactorySale.typePrefix)) &&
        status.success
      ) {
        validation.resetForm();
        toggle();
      }
    }
  }, [status]);

  // Failure
  useEffect(() => {
    if (show && status.failure) {
      if (errors && errors.status === 400) {
        validation.setErrors({ ...validation.errors, ...errors.data });
      } else {
        setAlertError("Əməliyyat zamanı xəta baş verdi!");
      }
    }
  }, [errors]);

  return (
    <Modal isOpen={show} toggle={toggle}>
      <ModalHeader toggle={toggle} tag="h4">
        {title}
      </ModalHeader>

      {alertError && (
        <Alert color="danger" className="text-center m-3">
          {alertError}
        </Alert>
      )}

      <ModalBody>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
            validation.handleSubmit();
            return false;
          }}>
          <Row>
            {/* Product */}
            <Col className="col-12 mb-3">
              <Label>Məhsul</Label>

              <Select
                name="product"
                options={productOptions || []}
                onInputChange={(e) => setProductName(e)}
                styles={getSelectStyle(validation, "product")}
                onChange={(e) => {
                  if (e && typeof e === "object" && e.value)
                    validation.setFieldValue("product", e.value);
                }}
                onBlur={() => {
                  validation.setFieldTouched("product", true);
                }}
                value={
                  validation.values.product &&
                  productOptions &&
                  productOptions.find(
                    (option) => option.value === validation.values.product
                  )
                }
              />

              {validation.touched.product && validation.errors.product ? (
                <FormFeedback type="invalid" className="d-block">
                  {validation.errors.product.toString()}
                </FormFeedback>
              ) : null}
            </Col>
          </Row>

          <Row>
            {/* Price */}
            <Col className="col-12 mb-3">
              <Label>Qiymət</Label>

              <Input
                type="number"
                name="price"
                placeholder="Qiymət daxil edin"
                onBlur={validation.handleBlur}
                onChange={validation.handleChange}
                value={validation.values.price}
                invalid={
                  validation.touched.price && validation.errors.price
                    ? true
                    : false
                }
              />

              {validation.touched.price && validation.errors.price ? (
                <FormFeedback type="invalid">
                  {validation.errors.price.toString()}
                </FormFeedback>
              ) : null}
            </Col>
          </Row>

          <Row>
            {/* Quantity */}
            <Col className="col-12 mb-3">
              <Label>Miqdar</Label>

              <Input
                type="number"
                name="quantity"
                placeholder="Miqdar daxil edin"
                onBlur={validation.handleBlur}
                onChange={validation.handleChange}
                value={validation.values.quantity}
                invalid={
                  validation.touched.quantity && validation.errors.quantity
                    ? true
                    : false
                }
              />

              {validation.touched.quantity && validation.errors.quantity ? (
                <FormFeedback type="invalid">
                  {validation.errors.quantity.toString()}
                </FormFeedback>
              ) : null}
            </Col>
          </Row>

          <Row>
            {/* Date */}
            <Col className="col-12 mb-3">
              <Label>Tarix</Label>

              <Input
                name="date"
                type="date"
                placeholder="Tarix daxil edin"
                onBlur={validation.handleBlur}
                onChange={validation.handleChange}
                value={validation.values.date}
                invalid={
                  validation.touched.date && validation.errors.date
                    ? true
                    : false
                }
              />

              {validation.touched.date && validation.errors.date ? (
                <FormFeedback type="invalid">
                  {validation.errors.date.toString()}
                </FormFeedback>
              ) : null}
            </Col>
          </Row>

          <Row>
            {/* Submit */}
            <Col className="text-end">
              <Button color="success" type="submit">
                {status && status.loading ? (
                  <Spinner color="primary" size="sm" className="mr-1" />
                ) : isEdit ? (
                  "Yadda Saxla"
                ) : (
                  "Əlavə et"
                )}
              </Button>
            </Col>
          </Row>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default FormModal;
