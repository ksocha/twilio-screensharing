import React from "react";
import PropTypes from "prop-types";

import { Form } from "react-bulma-components";

const { Field, Label, Control, Input } = Form;

const FieldInput = ({ value, name, label, placeholder, onChange }) => (
  <Field horizontal>
    <Field.Label size="normal">
      <Label>{label}</Label>
    </Field.Label>

    <Field.Body>
      <Field>
        <Control>
          <Input
            onChange={e => onChange(e.target.value)}
            name={name}
            placeholder={placeholder}
            value={value}
          />
        </Control>
      </Field>
    </Field.Body>
  </Field>
);

FieldInput.propTypes = {
  value: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
};

export default FieldInput;
