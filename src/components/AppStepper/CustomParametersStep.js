import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import { FormattedMessage } from 'react-intl';

import NextButton from './NextButton';
import BackButton from './BackButton';

class CustomParametersStep extends Component {
  constructor(props) {
    super(props);
    this.state = {
      customParams: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleBack = this.handleBack.bind(this);
  }

  componentDidUpdate(prevProps) {
    const { pstate } = this.props;

    const ncp = Object.keys(pstate.features)
      .filter((name) => name.startsWith('precustom#'))
      .reduce((acc, cval) => `${acc}\n${pstate.features[cval]}`, '');

    const pcp = Object.keys(prevProps.pstate.features)
      .filter((name) => name.startsWith('precustom#'))
      .reduce((acc, cval) => `${acc}\n${prevProps.pstate.features[cval]}`, '');

    if (ncp !== pcp) {
      this.setState({ customParams: ncp.trim() });
    }
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleNext() {
    const { nextHandler } = this.props;
    nextHandler({ ...this.state });
  }

  handleBack() {
    const { backHandler } = this.props;
    backHandler();
  }

  render() {
    const {
      classes,
      nextHandler,
      backHandler,
      ...other
    } = this.props;
    const { customParams } = this.state;
    const placeholder = `#ifdef USE_MCP230xx
#undef USE_MCP230xx
#endif
#define USE_MCP230xx

#ifdef USE_MCP230xx_ADDR
 #undef USE_MCP230xx_ADDR
#endif
#define USE_MCP230xx_ADDR 0x20`;

    return (
      <Step {...other}>
        <StepLabel>
          <FormattedMessage id="stepCustomParamsTitle" />
        </StepLabel>
        <StepContent>
          <Typography>
            <FormattedMessage
              values={{ filename: <em>user_config_override.h</em> }}
              id="stepCustomParamsDesc"
            />
          </Typography>
          <form noValidate autoComplete="off">
            <div className={classes.actionsContainer}>
              <TextField
                // id='reg_customParams'
                placeholder={placeholder}
                name="customParams"
                label={<FormattedMessage id="stepCustomParamsTitle" />}
                fullWidth
                multiline
                minRows={9}
                maxRows={9}
                className={classes.multiTextField}
                value={customParams}
                onChange={this.handleChange}
                margin="normal"
                InputProps={{
                  classes: {
                    input: classes.inputFont,
                  },
                }}
              />
            </div>
          </form>
          <div className={classes.actionsContainer}>
            <div className={classes.wrapper}>
              <BackButton disabled={false} onClick={this.handleBack} />
            </div>
            <div className={classes.wrapper}>
              <NextButton disabled={false} onClick={this.handleNext} />
            </div>
          </div>
        </StepContent>
      </Step>
    );
  }
}

CustomParametersStep.propTypes = {
  classes: PropTypes.oneOfType([PropTypes.object]).isRequired,
  pstate: PropTypes.oneOfType([PropTypes.object]).isRequired,
  nextHandler: PropTypes.func.isRequired,
  backHandler: PropTypes.func.isRequired,
};

export default CustomParametersStep;
