import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { Popup, Grid, Icon, Input } from 'semantic-ui-react';

const { Column } = Grid;

class CustomFilter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
    };
  }

  // ----------------------------------
  // ------- life cycle events --------
  // ----------------------------------
  componentDidMount() {
    this.props.updateFilterFunction(this.props.attribute, this.filterFunction.bind(this));
  }

  shouldComponentUpdate(nextProps, nextState) {
    return !isEqual(nextState, this.state) || !isEqual(nextProps, this.props);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.state.value !== prevState.value) {
      this.props.filterRequest();
    }
  }


  // ------------------------------
  // ------- handle events --------
  // ------------------------------
  onInputChange(event) {
    this.setState({ value: event.target.value });
  }

  filterFunction(currentItem) {
    const { attribute, customFilterFunction } = this.props;

    if (!this.state.value) {
      return true;
    }

    if (currentItem[attribute]) {
      return customFilterFunction(currentItem[attribute], this.state.value);
    }

    return false;
  }


  // -------------------------------
  // ------- render methods --------
  // -------------------------------
  render() {
    const filterIconColor = this.state.value ? '#e40000' : 'black';

    const triggerButton = (
      <Icon name="filter" style={{ marginRight: 5, color: filterIconColor, cursor: 'pointer' }} />
    );

    const popUpContent = (
      <Grid>
        <Column>
          <label htmlFor={this.input} style={styles.label}>Filtrar por {this.props.label}:</label>

          <Input
            fluid
            ref={(ref) => { this.input = ref; }}
            value={this.state.value}
            onChange={this.onInputChange.bind(this)}
            placeholder="Teclee un criterio"
          />
        </Column>
      </Grid>
    );

    return (
      <div style={{ display: 'inline-block', marginRight: 5 }}>
        <Popup
          flowing
          hoverable
          on="click"
          position="bottom center"
          trigger={triggerButton}
          content={popUpContent}
        />

        <span
          style={{ cursor: this.props.data.attribute ? 'pointer' : 'default' }}
          onClick={() => { this.props.onHeaderClick(this.props.data); }}
        >
          { this.props.label }
        </span>
      </div>
    );
  }
}


const styles = {
  button: {
    background: 'transparent',
    border: 'none',
  },
  label: {
    display: 'block',
    marginBottom: 5,
  },
};


CustomFilter.propTypes = {
  label: PropTypes.string,
  attribute: PropTypes.string,
  filterRequest: PropTypes.func,
  customFilterFunction: PropTypes.func,
  updateFilterFunction: PropTypes.func,
  onHeaderClick: PropTypes.func,
  data: PropTypes.object,
};


export default CustomFilter;
