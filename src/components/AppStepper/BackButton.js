import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import { FormattedMessage } from 'react-intl';

const BackButton = (props) => {
  const { disabled, onClick } = props;
  return (
    <Button
      disabled={disabled}
      variant="contained"
      color="primary"
      onClick={onClick}
    >
      <FormattedMessage id="btnBack" />
    </Button>
  );
};

BackButton.propTypes = {
  disabled: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default BackButton;
