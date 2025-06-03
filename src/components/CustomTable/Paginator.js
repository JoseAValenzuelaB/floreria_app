import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Menu, Icon } from 'semantic-ui-react';
import { isEqual } from 'lodash';


class Paginator extends Component {
  shouldComponentUpdate(nextProps) {
    return !isEqual(nextProps, this.props);
  }

  // ------------------------------
  // ------- handle events -------
  // ------------------------------
  onPreviousPageClick() {
    if (this.props.currentPage > 1) {
      this.props.onPageChange(this.props.currentPage - 1);
    }
  }

  onNextPageClick() {
    const availablePages = Math.ceil(this.props.dataLength / this.props.itemsPerPage);

    if (this.props.currentPage < availablePages) {
      this.props.onPageChange(this.props.currentPage + 1);
    }
  }


  // ------------------------------
  // ------- render methods -------
  // ------------------------------
  renderPages() {
    const { currentPage, dataLength, itemsPerPage } = this.props;
    const availablePages = Math.ceil(dataLength / itemsPerPage);
    const previousPage = currentPage - 1;
    const nextPage = currentPage + 1;
    const pages = [];

    // add previous page
    if (previousPage > 0) {
      pages.push(
        <Menu.Item
          key="previous"
          onClick={() => { this.props.onPageChange(previousPage); }}
          style={{ cursor: 'pointer' }}
        >
          <span style={{ userSelect: 'none' }}>{previousPage}</span>
        </Menu.Item>
      );
    }

    // add currentPage
    pages.push(
      <Menu.Item
        key="current"
        active
        style={{ cursor: 'pointer' }}
      >
        <span style={{ userSelect: 'none' }}>{currentPage}</span>
      </Menu.Item>
    );

    // add next page
    if (nextPage <= availablePages) {
      pages.push(
        <Menu.Item
          key="next"
          onClick={() => { this.props.onPageChange(nextPage); }}
          style={{ cursor: 'pointer' }}
        >
          <span style={{ userSelect: 'none' }}>{nextPage}</span>
        </Menu.Item>
      );
    }

    return pages;
  }

  render() {
    const { dataLength, itemsPerPage, currentPage } = this.props;
    const availablePages = Math.ceil(dataLength / itemsPerPage);

    return (
      <Menu floated="right" pagination style={this.props.style}>
        <Menu.Item as="a" icon disabled={currentPage === 1} onClick={() => { this.props.onPageChange(1); }}>
          <Icon name="left chevron" />
        </Menu.Item>

        { this.renderPages() }

        <Menu.Item as="a" icon disabled={currentPage >= availablePages} onClick={() => { this.props.onPageChange(availablePages); }} style={{ borderLeft: '1px solid #e8e8e9' }}>
          <Icon name="right chevron" />
        </Menu.Item>
      </Menu>
    );
  }
}


Paginator.propTypes = {
  style: PropTypes.object,
  dataLength: PropTypes.number,
  itemsPerPage: PropTypes.number,
  onPageChange: PropTypes.func,
  currentPage: PropTypes.number,
};


export default Paginator;
