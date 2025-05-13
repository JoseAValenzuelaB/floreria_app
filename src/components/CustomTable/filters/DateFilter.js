import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEqual } from 'lodash';
import { Popup, Grid, Icon, Input, Dropdown } from 'semantic-ui-react';

const { Row, Column } = Grid;
const EQUALS_TO = 'equals_to';
const GREATER_THAN = 'greater_than';
const LESS_THAN = 'less_than';
const RANGE = 'range';


class DateFilter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: '',
      secondValue: '',
      operator: EQUALS_TO,
      popUpVisible: false,
      hovering: false,
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
    const differentValue = prevState.value !== this.state.value;
    const differentSecondValue = prevState.secondValue !== this.state.secondValue;
    const differentOperator = prevState.operator !== this.state.operator;

    if (differentValue || differentSecondValue || differentOperator) {
      this.props.filterRequest();
    }
  }


  // ------------------------------
  // ------- handle events --------
  // ------------------------------
  onInputChange(event) {
    this.setState({ value: event.target.value });
  }

  onSecondInputChange(event) {
    this.setState({ secondValue: event.target.value });
  }

  onPopUpOpen() {
    this.setState({ popUpVisible: true });
  }

  onPopUpClose() {
    setTimeout(() => {
      if (!this.state.hovering) {
        this.setState({ popUpVisible: false });
      }
    }, 500);
  }

  filterFunction(currentItem) {
    const { attribute } = this.props;
    const currentDate = new Date(currentItem[attribute]);

    if (!this.state.value && !this.state.secondValue) {
      return true;
    }

    if (currentItem[attribute] === undefined || currentItem[attribute] === null) {
      return false;
    }

    // filtrar por rangos
    if (this.state.operator === RANGE) {
      const firstDate = new Date(this.state.value);
      const secondDate = new Date(this.state.secondValue);

      if (!this.state.value && !this.state.secondValue) {
        return true;
      }

      if (this.state.value && !this.state.secondValue) {
        return currentDate.getTime() >= firstDate.getTime();
      }

      if (!this.state.value && this.state.secondValue) {
        return currentDate.getTime() <= secondDate.getTime();
      }

      if (this.state.value && this.state.secondValue) {
        return currentDate.getTime() >= firstDate.getTime() && currentDate.getTime() <= secondDate.getTime();
      }
    }

    // otras opciones de filtrado
    if (!this.state.value) { return true; }
    const dateValue = new Date(this.state.value);

    switch (this.state.operator) {
      case EQUALS_TO:
        return currentDate.getTime() === dateValue.getTime();
      case LESS_THAN:
        return currentDate.getTime() < dateValue.getTime();
      case GREATER_THAN:
        return currentDate.getTime() > dateValue.getTime();
      default:
        return true;
    }
  }


  // -------------------------------
  // ------- render methods --------
  // -------------------------------
  renderInputs() {
    const { operator } = this.state;

    if (operator === RANGE) {
      return (
        <Row columns={2} style={{ paddingTop: 0 }}>
          <Column>
            <p style={{ marginBottom: 3 }}>Desde:</p>

            <Input
              fluid
              type="date"
              value={this.state.value}
              onChange={this.onInputChange.bind(this)}
            />
          </Column>

          <Column>
            <p style={{ marginBottom: 3 }}>Hasta:</p>

            <Input
              fluid
              type="date"
              value={this.state.secondValue}
              onChange={this.onSecondInputChange.bind(this)}
            />
          </Column>
        </Row>
      );
    }

    return (
      <Row style={{ paddingTop: 0 }}>
        <Column>
          <Input
            fluid
            type="date"
            value={this.state.value}
            onChange={this.onInputChange.bind(this)}
          />
        </Column>
      </Row>
    );
  }

  render() {
    const filtering = this.state.value || (this.state.operator === RANGE && this.state.secondValue);
    const filterIconColor = filtering ? '#e40000' : 'black';

    const options = [
      {
        text: 'Igual a',
        value: EQUALS_TO,
      },
      {
        text: 'Menor que',
        value: LESS_THAN,
      },
      {
        text: 'Mayor que',
        value: GREATER_THAN,
      },
      {
        text: 'Por rango',
        value: RANGE,
      },
    ];

    const triggerButton = (
      <Icon name="filter" style={{ marginRight: 5, color: filterIconColor, cursor: 'pointer' }} />
    );

    const popUpContent = (
      <Grid
        onMouseEnter={() => this.setState({ hovering: true })}
        onMouseLeave={() => this.setState({ hovering: false })}
      >
        <Row>
          <Column width={9} verticalAlign="middle">
            <span style={{ marginRight: 5 }}>
              Filtrar por {this.props.label}:
            </span>
          </Column>

          <Column width={7} verticalAlign="middle">
            <Dropdown
              fluid
              selection
              value={this.state.operator}
              options={options}
              onChange={(event, data) => { this.setState({ operator: data.value }); }}
            />
          </Column>
        </Row>

        { this.renderInputs() }
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
          open={this.state.popUpVisible}
          onOpen={this.onPopUpOpen.bind(this)}
          onClose={this.onPopUpClose.bind(this)}
          style={{ maxWidth: 420 }}
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


DateFilter.propTypes = {
  label: PropTypes.string,
  attribute: PropTypes.string,
  filterRequest: PropTypes.func,
  updateFilterFunction: PropTypes.func,
  onHeaderClick: PropTypes.func,
  data: PropTypes.object,
};


export default DateFilter;
