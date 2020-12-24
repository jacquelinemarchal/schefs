import React from 'react';
import * as Yup from 'yup';
import { Formik, Form } from 'formik';

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const defaultValues = {
  name: '',
  phone: '',
  addr1: '',
  addr2: '',
  city: '',
  state: '',
  zipcode: '',
  id: '',
};

const addressSchema = Yup.object().shape({
  name: Yup.string()
    .max(24, 'Too long!'),
  phone: Yup.string().matches(phoneRegExp, 'Please use simpler formatting'),
  addr1: Yup.string().required('Required'),
  addr2: Yup.string(),
  city: Yup.string()
    .required('Required'),
  // TODO: Update to dropdown select
  state: Yup.string()
    .min(2, 'Please use the 2-digit state code')
    .max(2, 'Please use the 2-digit state code')
    .required('Required'),
  zipcode: Yup.string()
    .matches(/^[0-9]*$/)
    .required('Required'),
  id: Yup.string(),
});

const NewAddressForm = ({ existingValues, handleSubmit, handleCancel }) => {
  const initialValues = {
    ...defaultValues,
    ...existingValues,
  };
  return (
    <div>
      <Formik
        initialValues={initialValues}
        validationSchema={addressSchema}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(true);
          handleSubmit(values);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <div className="form-two-up">
              <input
                label="Full Name"
                name="name"
              />
              <input
                label="Phone Number"
                name="phone"
              />
              <input
                label="Address"
                name="addr1"
              />
              <input label="Unit, suite, etc (Optional)" name="addr2" />
              <input label="City" name="city" />
              <input label="State" name="state" />
              <input label="Zipcode" name="zipcode" />
              <input type="hidden" value={initialValues.id} name="id" />
            </div>
            <div>
              <button
                type="submit"
                className="button primary"
                disabled={isSubmitting}
              >
                Save
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default NewAddressForm;
