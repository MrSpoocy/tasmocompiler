import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Divider from '@material-ui/core/Divider';
import { FormattedMessage } from 'react-intl';

import availableFeatures from './AvailableFeatures';
import { availableBoards, availableBoardChipTypes } from './AvailableBoards';
import FeaturesSelector from './FeaturesSelector';
import NextButton from '../NextButton';
import BackButton from '../BackButton';

const getFeatureGroup = (name) => {
  const filtered = availableFeatures.filter((e) => e.name === name && e.group);

  if (filtered.length > 0) {
    return filtered[0].group;
  }

  return [];
};

const getCustomParametersForFeature = (name) => {
  const filtered = availableFeatures.filter((e) => e.name === name && e.custom);
  if (filtered.length > 0) {
    return filtered[0].custom;
  }

  return '';
};

const getFeatureExclude = (name) => {
  const filtered = availableFeatures.filter(
    (e) => e.name === name && e.exclude,
  );

  if (filtered.length > 0) {
    return filtered[0].exclude;
  }

  return [];
};

const getFeatureInclude = (name) => {
  const filtered = availableFeatures.filter(
    (e) => e.name === name && e.include,
  );

  if (filtered.length > 0) {
    return filtered[0].include;
  }

  return [];
};

const getPlatformioEntriesForFeature = (name) => {
  const filtered = availableFeatures.filter(
    (e) => e.name === name && e.platformio_entries,
  );
  if (filtered.length > 0) {
    return filtered[0].platformio_entries;
  }

  return null;
};

const setFeature = (name, state) => {
  const newState = {};
  const group = getFeatureGroup(name);
  const custom = getCustomParametersForFeature(name);
  const entries = getPlatformioEntriesForFeature(name);

  newState[name] = state;
  group.forEach((item) => {
    newState[item] = state;
  });

  if (custom) {
    newState[`precustom#${name}`] = state ? custom : '';
  }

  if (entries) {
    newState[`platformio_entries#${name}`] = state ? entries : {};
  }
  return newState;
};

const setIncludeExcludeFeature = (name) => {
  let newState = {};
  const excludeGroup = getFeatureExclude(name);
  const includeGroup = getFeatureInclude(name);

  excludeGroup.forEach((item) => {
    newState = {
      ...newState,
      ...setFeature(item, false),
    };
  });
  includeGroup.forEach((item) => {
    newState = {
      ...newState,
      ...setFeature(item, true),
    };
  });
  return newState;
};

const getFeaturesDefaultStates = (board) => {
  let defaults = {};
  let toIncludeExclude = {};
  availableFeatures.forEach((feature) => {
    if (
      feature.boards.includes(board.name)
        || feature.boards.includes('all')
        || board.include_features.includes(feature.name)
    ) {
      const value = board.include_features.includes(feature.name)
        ? true
        : feature.value;
      const defaultFeatureState = setFeature(feature.name, value);
      defaults = { ...defaults, ...defaultFeatureState };
      // defaults[feature.name] = value;
      // const group = getFeatureGroup(feature.name);
      // group.forEach((g) => {
      //   defaults[g] = value;
      // });

      if (value) {
        toIncludeExclude = {
          ...toIncludeExclude,
          ...setIncludeExcludeFeature(feature.name),
        };
      }
    }
  });
  defaults = { ...defaults, ...toIncludeExclude };
  return defaults;
};

class FeaturesStep extends Component {
  constructor(props) {
    super(props);

    const defaultBoard = availableBoards.filter((b) => b.default === true);
    const defaultStates = getFeaturesDefaultStates(defaultBoard[0]);
    this.state = { features: { board: defaultBoard[0], ...defaultStates } };
    this.handleChangeCheckBox = this.handleChangeCheckBox.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
  }

  handleChangeCheckBox(event) {
    const { checked, name } = event.target;
    let featureState = setFeature(name, checked);

    if (checked) {
      featureState = { ...featureState, ...setIncludeExcludeFeature(name) };
    }

    this.setState((state) => {
      const newFeatures = { ...state.features, ...featureState };
      // let newFeatures = Object.assign({}, state.features, featureState);

      // Object.keys(featureState).forEach((f) => {
      //   newFeatures[f] = featureState[f];
      // });
      return { features: { ...newFeatures } };
    });
  }

  handleNext() {
    const { nextHandler } = this.props;
    nextHandler({ ...this.state });
  }

  handleBack() {
    const { backHandler } = this.props;
    backHandler();
  }

  handleRadioChange(event) {
    const boards = availableBoards.filter((b) => b.name === event.target.value);
    const defaultStates = getFeaturesDefaultStates(boards[0]);
    this.setState({ features: { board: boards[0], ...defaultStates } });
  }

  render() {
    const { features: { board, ...tempState } } = this.state;
    const {
      classes, nextHandler, backHandler, ...other
    } = this.props;
    const Wire = ({ children, ...props }) => children(props);
    return (
      <Step {...other}>
        <StepLabel>
          <FormattedMessage id="stepFeaturesTitle" />
        </StepLabel>
        <StepContent>
          <Typography>
            <FormattedMessage id="stepFeaturesBoardDesc" />
          </Typography>

          <div className={classes.actionsContainer}>
            <FormControl>
              {availableBoardChipTypes.map((chipType, idx) => (
                <div
                  className={classes.chipTypesContainer}
                  key={chipType.name}
                >
                  <Typography>{chipType.name.toUpperCase()}</Typography>
                  <RadioGroup
                    row
                    aria-label="board"
                    name="board"
                    value={board.name}
                    onChange={this.handleRadioChange}
                  >
                    {availableBoards.map((item) => {
                      const {
                        // eslint-disable-next-line camelcase
                        name, description, tooltip, show, chip_type,
                      } = item;
                      return (
                        // eslint-disable-next-line camelcase
                        chip_type === chipType.name
                          && show && (
                            // tooltips workaround
                            <Wire value={name} key={item.name}>
                              {(props) => (
                                <Tooltip
                                  title={
                                    tooltip ? (
                                      <FormattedMessage id={tooltip} />
                                    ) : (
                                      ''
                                    )
                                  }
                                >
                                  <div className={classes.radioContainer}>
                                    <FormControlLabel
                                      control={<Radio />}
                                      label={description}
                                      labelPlacement="end"
                                      {...props}
                                    />
                                  </div>
                                </Tooltip>
                              )}
                            </Wire>
                        )
                      );
                    })}
                  </RadioGroup>
                  {idx < availableBoardChipTypes.length - 1 && (
                  <Divider className={classes.boardsDivider} />
                  )}
                </div>
              ))}
            </FormControl>
          </div>

          <Typography>
            <FormattedMessage id="stepFeaturesDesc" />
          </Typography>
          <div className={classes.actionsContainer}>
            {availableFeatures.map(
              (item) => item.show
                && (item.boards.includes(board.name)
                  || item.boards.includes('all')) && (
                  <FeaturesSelector
                    classes={classes}
                    // value={this.state[item.name]}
                    value={tempState[item.name]}
                    item={item}
                    onChange={this.handleChangeCheckBox}
                    key={item.name}
                  />
              ),
            )}
          </div>
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

FeaturesStep.propTypes = {
  classes: PropTypes.oneOfType([PropTypes.object]).isRequired,
  nextHandler: PropTypes.func.isRequired,
  backHandler: PropTypes.func.isRequired,
};

export default FeaturesStep;
