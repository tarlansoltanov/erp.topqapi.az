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

// Constants
import { USER_ROLES } from "@/constants";

// Helpers
import { formatPrice, getOptions, getSelectStyle } from "@/helpers";

// Types
import { Option } from "@/types/option";

// Actions
import { getBranches, getSellers, createOrder } from "@/store/actions";

interface Props {
  show: boolean;
  toggle: () => void;
  handleSubmit: (formData: any) => void;
}

const OrderModal = ({ show, toggle, handleSubmit }: Props) => {
  const title = "Satış məlumatlarını daxil et";

  const dispatch = useDispatch<AppDispatch>();

  const { user } = useSelector((state: RootState) => state.account);
  const { status, errors } = useSelector((state: RootState) => state.order);

  const [alertError, setAlertError] = useState<string>("");

  // Validation
  const validation = useFormik({
    enableReinitialize: true,

    initialValues: {
      branch: (user && user.type === USER_ROLES.STORE && user.branch.id) || "",
      seller: "",
      customer: "",
      phone: "",
      address: "",
      payed: "",
      seller_share: "",
      sale_date: new Date().toISOString().split("T")[0],
      delivery_date: "",
      install_date: "",
      note: "",
    },

    validationSchema: Yup.object({
      branch: Yup.number().required("Zəhmət olmasa filial seçin!"),
      seller: Yup.number().required("Zəhmət olmasa satıcı seçin!"),
      customer: Yup.string().required("Zəhmət olmasa müştəri adı daxil edin!"),
      phone: Yup.string().required("Zəhmət olmasa telefon nömrəsi daxil edin!"),
      address: Yup.string().required("Zəhmət olmasa ünvan daxil edin!"),
      payed: Yup.number().required("Zəhmət olmasa ödənilən məbləğ daxil edin!"),
      seller_share: Yup.number(),
      sale_date: Yup.string().required("Zəhmət olmasa tarix daxil edin!"),
      delivery_date: Yup.string(),
      install_date: Yup.string(),
      note: Yup.string(),
    }),

    onSubmit: (values) => {
      const formData = new FormData();

      // Branch
      formData.append("branch", values["branch"].toString());

      // Seller
      formData.append("seller", values["seller"]);

      // Customer
      formData.append("customer", values["customer"]);

      // Phone
      formData.append("phone", values["phone"]);

      // Address
      formData.append("address", values["address"]);

      // Payed
      formData.append("payed", values["payed"].toString());

      // Seller Share
      formData.append("seller_share", values["seller_share"].toString());

      // Sale Date
      formData.append("sale_date", values["sale_date"]);

      // Delivery Date
      formData.append("delivery_date", values["delivery_date"]);

      // Install Date
      formData.append("install_date", values["install_date"]);

      // Note
      formData.append("note", values["note"]);

      handleSubmit(formData);
    },
  });

  // Branch Options
  const { items: branches } = useSelector((state: RootState) => state.branch);

  const [branchName, setBranchName] = useState<string>("");
  const [branchOptions, setBranchOptions] = useState<Option[]>([]);

  useEffect(() => {
    dispatch(getBranches({ name: branchName }));
  }, [branchName]);

  useEffect(() => {
    setBranchOptions(getOptions(branches));
  }, [branches]);

  useEffect(() => {
    if (user && user.type === USER_ROLES.STORE) {
      setBranchName(user.branch.name);
    }
  }, [user]);

  // Seller Options
  const { items: sellers } = useSelector((state: RootState) => state.seller);

  const [sellerName, setSellerName] = useState<string>("");
  const [sellerOptions, setSellerOptions] = useState<Option[]>([]);

  useEffect(() => {
    dispatch(
      getSellers({
        name: sellerName,
        branch_id: Number(validation.values.branch),
      })
    );
  }, [sellerName, validation.values.branch]);

  useEffect(() => {
    setSellerOptions(getOptions(sellers));
  }, [sellers]);

  useEffect(() => {
    validation.values.seller = "";
  }, [validation.values.branch]);

  const [priceSum, setPriceSum] = useState<number>(0);

  // Order Cart
  const { items } = useSelector((state: RootState) => state.orderCart);

  useEffect(() => {
    if (items && items.length > 0) {
      const sum = items.reduce(
        (a, b) =>
          Number(a) + Number(b["price"] || 0) * Number(b["quantity"] || 0),
        0
      );
      setPriceSum(sum);
    }
  }, [items]);

  // Success
  useEffect(() => {
    if (show && status) {
      if (status.lastAction === createOrder.typePrefix && status.success) {
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
            {/* Branch */}
            <Col className="col-12 col-lg-6 mb-3">
              <Label>Filial</Label>

              <Select
                name="branch"
                options={branchOptions || []}
                isDisabled={user?.type === USER_ROLES.STORE}
                onInputChange={(e) => setBranchName(e)}
                styles={getSelectStyle(validation, "branch")}
                onChange={(e) => {
                  if (e && typeof e === "object" && e.value)
                    validation.setFieldValue("branch", e.value);
                }}
                onBlur={() => {
                  validation.setFieldTouched("branch", true);
                }}
                value={
                  validation.values.branch &&
                  branchOptions &&
                  branchOptions.find(
                    (option) => option.value === validation.values.branch
                  )
                }
              />

              {validation.touched.branch && validation.errors.branch ? (
                <FormFeedback type="invalid" className="d-block">
                  {validation.errors.branch.toString()}
                </FormFeedback>
              ) : null}
            </Col>

            {/* Seller */}
            <Col className="col-12 col-lg-6 mb-3">
              <Label>Satıcı</Label>

              <Select
                name="seller"
                options={sellerOptions || []}
                isDisabled={!validation.values.branch}
                onInputChange={(e) => setSellerName(e)}
                styles={getSelectStyle(validation, "seller")}
                onChange={(e) => {
                  if (e && typeof e === "object" && e.value)
                    validation.setFieldValue("seller", e.value);
                }}
                onBlur={() => {
                  validation.setFieldTouched("seller", true);
                }}
                value={
                  validation.values.seller &&
                  sellerOptions &&
                  sellerOptions.find(
                    (option) => option.value === validation.values.seller
                  )
                }
              />

              {validation.touched.seller && validation.errors.seller ? (
                <FormFeedback type="invalid" className="d-block">
                  {validation.errors.seller.toString()}
                </FormFeedback>
              ) : null}
            </Col>
          </Row>

          <Row>
            {/* Customer */}
            <Col className="col-12 col-lg-6 mb-3">
              <Label>Müştəri adı</Label>

              <Input
                type="text"
                name="customer"
                placeholder="Müştəri adını daxil edin"
                onBlur={validation.handleBlur}
                onChange={validation.handleChange}
                value={validation.values.customer}
                invalid={
                  validation.touched.customer && validation.errors.customer
                    ? true
                    : false
                }
              />

              {validation.touched.customer && validation.errors.customer ? (
                <FormFeedback type="invalid">
                  {validation.errors.customer.toString()}
                </FormFeedback>
              ) : null}
            </Col>

            {/* Phone */}
            <Col className="col-12 col-lg-6 mb-3">
              <Label>Müştəri telefon nömrəsi</Label>

              <Input
                type="text"
                name="phone"
                placeholder="Müştəri telefon nömrəsi daxil edin"
                onBlur={validation.handleBlur}
                onChange={validation.handleChange}
                value={validation.values.phone}
                invalid={
                  validation.touched.phone && validation.errors.phone
                    ? true
                    : false
                }
              />

              {validation.touched.phone && validation.errors.phone ? (
                <FormFeedback type="invalid">
                  {validation.errors.phone.toString()}
                </FormFeedback>
              ) : null}
            </Col>
          </Row>

          <Row>
            {/* Address */}
            <Col className="col-12 mb-3">
              <Label>Müştəri ünvanı</Label>

              <Input
                type="text"
                name="address"
                placeholder="Müştəri ünvanını daxil edin"
                onBlur={validation.handleBlur}
                onChange={validation.handleChange}
                value={validation.values.address}
                invalid={
                  validation.touched.address && validation.errors.address
                    ? true
                    : false
                }
              />

              {validation.touched.address && validation.errors.address ? (
                <FormFeedback type="invalid">
                  {validation.errors.address.toString()}
                </FormFeedback>
              ) : null}
            </Col>
          </Row>

          <Row>
            {/* Total */}
            <Col className="col-12 mb-3">
              <Label>Cəm</Label>

              <Input
                type="text"
                name="total"
                placeholder="Ümumi Cəm"
                value={formatPrice(priceSum)}
                disabled={true}
              />
            </Col>
          </Row>

          <Row>
            {/* Payed */}
            <Col className="col-12 col-lg-6 mb-3">
              <Label>Ödənilən məbləğ</Label>

              <Input
                type="number"
                name="payed"
                placeholder="Ödənilən məbləğ daxil edin"
                onBlur={validation.handleBlur}
                onChange={validation.handleChange}
                value={validation.values.payed}
                invalid={
                  validation.touched.payed && validation.errors.payed
                    ? true
                    : false
                }
              />

              {validation.touched.payed && validation.errors.payed ? (
                <FormFeedback type="invalid">
                  {validation.errors.payed.toString()}
                </FormFeedback>
              ) : null}
            </Col>

            {/* Debt */}
            <Col className="col-12 col-lg-6 mb-3">
              <Label>Qalıq məbləğ</Label>

              <Input
                type="text"
                name="debt"
                placeholder="Qalıq"
                value={formatPrice(
                  priceSum - Number(validation.values.payed || 0)
                )}
                disabled={true}
              />
            </Col>
          </Row>

          <Row>
            {/* Seller Share */}
            <Col className="col-12 col-lg-6 mb-3">
              <Label>Satıcı Payı</Label>

              <Input
                type="number"
                name="seller_share"
                placeholder="Satıcı Payı daxil edin"
                onBlur={validation.handleBlur}
                onChange={validation.handleChange}
                value={validation.values.seller_share}
                invalid={
                  validation.touched.seller_share &&
                  validation.errors.seller_share
                    ? true
                    : false
                }
              />

              {validation.touched.seller_share &&
              validation.errors.seller_share ? (
                <FormFeedback type="invalid">
                  {validation.errors.seller_share.toString()}
                </FormFeedback>
              ) : null}
            </Col>

            {/* Sale Date */}
            <Col className="col-12 col-lg-6 mb-3">
              <Label>Satış Tarixi</Label>

              <Input
                name="sale_date"
                type="date"
                placeholder="Satış tarixi daxil edin"
                onBlur={validation.handleBlur}
                onChange={validation.handleChange}
                value={validation.values.sale_date}
                invalid={
                  validation.touched.sale_date && validation.errors.sale_date
                    ? true
                    : false
                }
              />

              {validation.touched.sale_date && validation.errors.sale_date ? (
                <FormFeedback type="invalid">
                  {validation.errors.sale_date.toString()}
                </FormFeedback>
              ) : null}
            </Col>
          </Row>

          <Row>
            {/* Delivery Date */}
            <Col className="col-12 col-lg-6 mb-3">
              <Label>Çatdırılma Tarixi</Label>

              <Input
                name="delivery_date"
                type="date"
                placeholder="Çatdırılma tarixi daxil edin"
                onBlur={validation.handleBlur}
                onChange={validation.handleChange}
                value={validation.values.delivery_date}
                invalid={
                  validation.touched.delivery_date &&
                  validation.errors.delivery_date
                    ? true
                    : false
                }
              />

              {validation.touched.delivery_date &&
              validation.errors.delivery_date ? (
                <FormFeedback type="invalid">
                  {validation.errors.delivery_date.toString()}
                </FormFeedback>
              ) : null}
            </Col>

            {/* Install Date */}
            <Col className="col-12 col-lg-6 mb-3">
              <Label>Quraşdırılma Tarixi</Label>

              <Input
                name="install_date"
                type="date"
                placeholder="Quraşdırılma tarixi daxil edin"
                onBlur={validation.handleBlur}
                onChange={(e) => {
                  validation.setFieldValue("worker", "");
                  validation.handleChange(e);
                }}
                value={validation.values.install_date}
                invalid={
                  validation.touched.install_date &&
                  validation.errors.install_date
                    ? true
                    : false
                }
              />

              {validation.touched.install_date &&
              validation.errors.install_date ? (
                <FormFeedback type="invalid">
                  {validation.errors.install_date.toString()}
                </FormFeedback>
              ) : null}
            </Col>
          </Row>

          <Row>
            {/* Note */}
            <Col className="col-12 mb-3">
              <Label>Qeyd</Label>

              <Input
                type="textarea"
                name="note"
                placeholder="Qeyd daxil edin"
                onBlur={validation.handleBlur}
                onChange={validation.handleChange}
                value={validation.values.note}
                invalid={
                  validation.touched.note && validation.errors.note
                    ? true
                    : false
                }
              />

              {validation.touched.note && validation.errors.note ? (
                <FormFeedback type="invalid">
                  {validation.errors.note.toString()}
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
                ) : (
                  "Yadda Saxla"
                )}
              </Button>
            </Col>
          </Row>
        </Form>
      </ModalBody>
    </Modal>
  );
};

export default OrderModal;
