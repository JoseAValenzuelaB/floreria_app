import React, { Component } from 'react';
import PropTypes from 'prop-types';
import transitions from '../../utils/transitions';
import { Table } from 'semantic-ui-react';

const INITIAL_VALUE = 0;
const FINAL_VALUE = 1;


class FadeableRow extends Component {
  constructor(props) {
    super(props);

    this.state = {
      opacity: props.animated ? INITIAL_VALUE : FINAL_VALUE,
    };
  }

  componentDidMount() {
    if (this.props.animated) {
      const delay = this.props.delay || 0;

      const params = {
        initialValue: INITIAL_VALUE,
        finalValue: FINAL_VALUE,
        duration: this.props.duration || 500,
      };

      setTimeout(() => {
        transitions.easePolyOut(params, (response) => {
          if (!this.unmounted) {
            this.setState({ opacity: response.value });
          }
        });
      }, delay);
    }
  }

  componentWillUnmount() {
    this.unmounted = true;
  }


  // ------------------------------
  // ------- render methods -------
  // ------------------------------
  render() {
    const { onClick } = this.props;
    const { opacity } = this.state;

    return (
      <Table.Row style={{ opacity }} onClick={onClick}>
        { this.props.children }
      </Table.Row>
    );
  }
}


FadeableRow.propTypes = {
  animated: PropTypes.bool,
  onClick: PropTypes.func,
  delay: PropTypes.number,
  duration: PropTypes.number,
  children: PropTypes.any,
};


export default FadeableRow;
