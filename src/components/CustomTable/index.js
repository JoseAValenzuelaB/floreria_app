import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Table, Grid, Dropdown, Icon, Dimmer, Loader, Segment } from 'semantic-ui-react';
import { isEqual, cloneDeep } from 'lodash';
import formatter from '../../utils/formatter';
import StringFilter from './filters/StringFilter';
import NumberFilter from './filters/NumberFilter';
import DateFilter from './filters/DateFilter';
import CustomFilter from './filters/CustomFilter';
import Paginator from './Paginator';
import { BLUE, WHITE } from '../../utils/Colors';
import FadeableRow from './FadeableRow';

const ASCENDING = 'ascending';
const DESCENDING = 'descending';
const { Row, Column } = Grid;


class CustomTable extends Component {
  constructor(props) {
    super(props);
    this.filterFunctions = {};

    this.state = {
      innerData: cloneDeep(props.data),
      page: 1,
      itemsPerPage: props.itemsPerPage || 10,
      itemsPerPageOptions: [10, 20, 50],

      orderBy: props.defaultOrder ? props.defaultOrder : null,
      direction: props.orderDirection ? props.orderDirection : ASCENDING,
    };
  }

  // ---------------------------
  // ---- life cycle events ----
  // ---------------------------
  UNSAFE_componentWillReceiveProps(nextProps) {
    if (!isEqual(nextProps.data, this.props.data)) {
      this.onInnerDataChange(nextProps.data);
    }

    if (nextProps.itemsPerPage && nextProps.itemsPerPage !== this.props.itemsPerPage) {
      this.setState({ itemsPerPage: nextProps.itemsPerPage });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const { clean } = formatter;
    return !isEqual(nextState, this.state) || !isEqual(clean(nextProps), clean(this.props));
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.itemsPerPage !== this.state.itemsPerPage) {
      this.resetPage();
    }
  }


  // -----------------------
  // ---- handle events ----
  // -----------------------
  onHeaderClick(header) {
    if (header.attribute && !header.component) {
      const orderingByTheSame = this.state.orderBy === header.attribute;
      const oppositeDirection = this.state.direction === ASCENDING ? DESCENDING : ASCENDING;
      const direction = orderingByTheSame ? oppositeDirection : ASCENDING;

      this.setState({ orderBy: header.attribute, direction });
    }

    if (header.attribute && header.component) {

      const orderingByTheSame = this.state.orderBy === header.attribute;
      const oppositeDirection = this.state.direction === ASCENDING ? DESCENDING : ASCENDING;
      const direction = orderingByTheSame ? oppositeDirection : ASCENDING;

      this.setState({ orderBy: header.attribute, direction });
    }
  }

  onPageChange(page) {
    this.setState({ page });
  }

  onInnerDataChange(newData) {
    if (newData.length !== this.state.innerData.length) {
      this.setState({ page: 1 });
    }

    this.setState({ innerData: cloneDeep(newData) });
  }

  getAttributeType(attribute) {
    const { data } = this.props;

    for (let index = 0; index < data.length; index += 1) {
      const element = data[index];

      if (element[attribute]) {
        const attributeType = typeof element[attribute];

        if (attributeType === 'string') {
          const parsedDate = new Date(element[attribute]);
          return parsedDate.getTime() ? 'date' : 'string';
        }

        return attributeType;
      }
    }

    return null;
  }

  orderData(data) {
    const { orderBy, direction } = this.state;

    if (orderBy) {
      return data.sort((a, b) => {
        const attributeType = typeof a[orderBy];
        const aValue = a[orderBy];
        const bValue = b[orderBy];

        switch (attributeType) {
        case 'number':
          if (direction === ASCENDING) {
            if (aValue < bValue) {
              return -1;
            }
            if (aValue > bValue) {
              return 1;
            }

            return 0;
          }

          if (aValue > bValue) {
            return -1;
          }
          if (aValue < bValue) {
            return 1;
          }

          return 0;
        case 'string': // eslint-disable-line no-case-declarations
          const nameA = aValue ? aValue.toString().toUpperCase() : '';
          const nameB = bValue ? bValue.toString().toUpperCase() : '';

          if (direction === ASCENDING) {
            if (nameA < nameB) {
              return -1;
            }

            if (nameA > nameB) {
              return 1;
            }

            return 0;
          }

          if (nameA > nameB) {
            return -1;
          }

          if (nameA < nameB) {
            return 1;
          }

          return 0;
        default:
          return 0;
        }
      });
    }

    return data;
  }

  updateFilterFunction(attribute, func) {
    this.filterFunctions[attribute] = func;
  }

  filterRequest() {
    let filteredData = [...this.props.data];

    Object.keys(this.filterFunctions).forEach((attribute) => {
      const filterFunction = this.filterFunctions[attribute];
      filteredData = filteredData.filter(filterFunction);
    });

    this.setState({ innerData: filteredData, page: 1 });
  }

  resetPage() {
    this.setState({ page: 1 });
  }


  // ------------------------
  // ---- render methods ----
  // ------------------------
  renderHeader() {
    const upArrow = <Icon name="caret up" style={{ height: 18, width: 18, color: BLUE, backgroundColor: WHITE, padding: 1, borderRadius: 3, cursor: 'pointer' }} />;
    const downArrow = <Icon name="caret down" style={{ height: 18, width: 18, color: BLUE, backgroundColor: WHITE, padding: 1, borderRadius: 3, cursor: 'pointer' }} />;
    const sortIcon = <Icon name="sort" style={{ height: 18, width: 18, color: BLUE, backgroundColor: WHITE, padding: 1, borderRadius: 3, cursor: 'pointer' }}/>;

    return this.props.headers.map((item, index) => {
      let arrowIcon;

      const textAlign = item.align || 'left';
      const orderingByThis = this.state.orderBy === item.attribute;

      const headerStyle = {
        userSelect: 'none',
        paddingTop: 20,
        height: 50,
        paddingBottom: 0,
        ...item.style,
      };

      if (index < this.props.headers.length - 1) {
        headerStyle.borderRight = 'none';
      }

      if (!orderingByThis && item.attribute && item.component) {
        arrowIcon = sortIcon;
      }

      if (orderingByThis && this.state.direction === 'ascending') {
        arrowIcon = upArrow;
      }

      if (orderingByThis && this.state.direction === 'descending') {
        arrowIcon = downArrow;
      }

      // casos para no renderizar un componente filtro
      if (!item.attribute || !item.filtered || !this.props.data.length) {
        const value = item ? (item.label || '') : '';
        let label = item.label;

        if (this.props.data.length === 5 && typeof item.label === 'object') {
          if (item.component.props.primal) {
            label = 'Primal/Group';
          }
          if (item.component.props.typeCattle) {
            label = 'Class Cow';
          }
          if (item.component.props.subPrimal) {
            label = 'Sub-primal/Item';
          }
          if (item.component.props.grade) {
            label = 'Grade';
          }
        }
        if (typeof item.label === 'string' && value.split('\n').length > 1) {
          label = value.split('\n').map((str, i) => <p style={{ margin: 0 }} key={`${str}-${i}`}>{str}</p>);
        }


        return (
          <Table.HeaderCell
            key={index}
            style={headerStyle}
            textAlign={textAlign}
            onClick={() => { this.onHeaderClick(item); }}
          >
            <span
              style={{ marginRight: 10, cursor: item.attribute ? 'pointer' : 'default' }}
            >
              {label}
            </span>
            {arrowIcon}
          </Table.HeaderCell>
        );
      }

      // seleccionar tipo de componente filtro basado en el tipo de dato
      let filterComponent;
      let attributeType = this.getAttributeType(item.attribute);
      const customFiltering = typeof item.filtered === 'function';

      if (customFiltering) {
        attributeType = 'custom';
      }

      const filterProps = {
        data: item,
        label: item.label,
        attribute: item.attribute,
        updateFilterFunction: this.updateFilterFunction.bind(this),
        filterRequest: this.filterRequest.bind(this),
        onHeaderClick: this.onHeaderClick.bind(this),
      };

      switch (attributeType) {
      case 'string':
        filterComponent = <StringFilter {...filterProps} />;
        break;
      case 'number':
        filterComponent = <NumberFilter {...filterProps} />;
        break;
      case 'date':
        filterComponent = <DateFilter {...filterProps} />;
        break;
      case 'custom':
        filterComponent = <CustomFilter {...filterProps} customFilterFunction={item.filtered} />;
        break;
      default:
        return (
          <Table.HeaderCell
            key={index}
            style={headerStyle}
            textAlign={textAlign}
          >
            <span
              style={{ marginRight: 10, cursor: 'pointer' }}
              onClick={() => { this.onHeaderClick(item); }}
            >
              {item.label}
            </span>
            {arrowIcon}
          </Table.HeaderCell>
        );
      }

      return (
        <Table.HeaderCell
          key={index}
          style={headerStyle}
          textAlign={textAlign}
        >
          {filterComponent}
          {arrowIcon}
        </Table.HeaderCell>
      );
    });
  }

  renderTextCell(header, rowData) {
    const { format, attribute } = header;
    const currentCellValue = rowData[attribute];

    if (format === 'capitalize') {
      return formatter.capitalize(currentCellValue);
    }

    if (format === 'date') {
      return formatter.date(currentCellValue);
    }

    if (format === 'dateDMY') {
      return formatter.date(currentCellValue, 'L');
    }

    if (format === 'dateTime') {
      return formatter.date(currentCellValue, 'LLL');
    }

    if (format === 'currency') {
      return formatter.currency(currentCellValue);
    }

    if (format === 'phone') {
      return formatter.applyMask('(xxx) xxx xxxx', currentCellValue);
    }

    if (currentCellValue && typeof currentCellValue === 'object') {
      return currentCellValue.toString();
    }

    return currentCellValue;
  }

  renderCells(rowData) {
    return this.props.headers.map((header, index) => {
      const textAlign = header.align || 'left';

      if (header.attribute && !header.component) {
        return (
          <Table.Cell key={index} style={rowData.style ? rowData.style : this.props.cellStyle} textAlign={textAlign}>
            {this.renderTextCell(header, rowData)}
          </Table.Cell>
        );
      }

      if (header.component) {
        const customCell = React.cloneElement(header.component, { data: rowData });

        return (
          <Table.Cell key={index} textAlign={textAlign} style={{ paddingLeft: 0, paddingRight: 0, ...this.props.cellStyle }}>
            {customCell}
          </Table.Cell>
        );
      }

      return (
        <Table.Cell key={index} style={this.props.cellStyle} textAlign={textAlign} />
      );
    });
  }

  renderFooter() {
    const { footerDisabled } = this.props;

    if (!footerDisabled) {
      const { page, itemsPerPage } = this.state;
      const start = (page * itemsPerPage) - itemsPerPage;
      const end = start + itemsPerPage;
      const dataLength = this.state.innerData.length;

      const optionsPerPage = this.state.itemsPerPageOptions.map((itemOption) => ({
        text: itemOption,
        value: itemOption,
      }));

      return (
        <Table.Row style={{ textAlign: 'right', background: 'rgba(128, 128, 128, 0.09)', ...this.props.footerStyle }}>
          <Table.Cell colSpan={this.props.headers.length} style={this.props.cellStyle}>
            <Grid>
              <Row columns={3} style={{ display: 'flex', alignItems: 'center', paddingBottom: 10, paddingTop: 7 }}>
                <Column style={{ textAlign: 'left', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  {/* label de elementos mostrandose */}
                  <span>Se muestran del {start + 1} al {end > dataLength ? dataLength : end} de {dataLength} en total.</span>
                </Column>

                {/* selector de items por pagina */}
                <Column style={{ textAlign: 'center' }}>
                  <span style={{ marginRight: 5 }}>Items per page: </span>
                  <Dropdown
                    value={this.state.itemsPerPage}
                    selection
                    upward
                    compact
                    options={optionsPerPage}
                    onChange={(event, data) => { this.setState({ itemsPerPage: data.value }); }}
                  />
                </Column>

                {/* paginador */}
                <Column style={{ textAlign: 'right' }}>
                  <Paginator
                    style={this.props.paginatorStyle}
                    currentPage={this.state.page}
                    onPageChange={this.onPageChange.bind(this)}
                    itemsPerPage={this.state.itemsPerPage}
                    dataLength={this.state.innerData.length}
                  />
                </Column>
              </Row>
            </Grid>
          </Table.Cell>
        </Table.Row>
      );
    }

    return null;
  }

  renderTotal() {
    const { loading } = this.props;
    const dataToShow = this.props.total;

    if(!dataToShow || loading){
      return null;
    }

    if (this.props.totalRowClick) {
      let onRowClick = () => { };

      if (this.props.onRowClick) {
        onRowClick = this.props.onRowClick;
      }

      return (
        <Table.Row
          style={this.props.totalStyle}
          onClick={() => {
            onRowClick(this.props.totalRowClick);
          }}
        >
          {dataToShow.map((item, index) => (
            <Table.Cell
              key={index}
              style={{ textAlign: "center", ...item.style }}
            >
              {item.label}
            </Table.Cell>
          ))}
        </Table.Row>
      );
    }

    return (<Table.Row style={this.props.totalStyle}>
      {dataToShow.map((item, index) => (

        <Table.Cell key={index}
          style={{ textAlign: 'center', ...item.style }}
        >
          {item.label}
        </Table.Cell>
      ))}

    </Table.Row>
    );
  }

  renderBody() {
    const { placeholder, loading } = this.props;
    const { page, itemsPerPage, innerData } = this.state;
    const start = (page * itemsPerPage) - itemsPerPage;
    const end = start + itemsPerPage;
    const dataToShow = [];
    const orderedData = this.orderData(innerData);

    if (loading) {
      return (
        <Table.Row>
          <Table.Cell
            style={{ textAlign: 'center', paddingTop: 20, paddingBottom: 20 }}
            colSpan={this.props.headers.length}
          >
            <Segment style={{ height: 100 }}>
              <Dimmer active inverted>
                <Loader>Loading...</Loader>
              </Dimmer>
            </Segment>
          </Table.Cell>
        </Table.Row>
      );
    }

    if (!innerData.length && this.props.noDataContainer) {
      return (
        <Table.Row>
          <Table.Cell
            style={{ textAlign: 'center', paddingTop: 40, paddingBottom: 40 }}
            colSpan={this.props.headers.length}
          >
            {this.props.noDataContainer}
          </Table.Cell>
        </Table.Row>
      );
    }

    if (!innerData.length) {
      return (
        <Table.Row>
          <Table.Cell
            style={{ textAlign: 'center', paddingTop: 20, paddingBottom: 20 }}
            colSpan={this.props.headers.length}
          >
            {placeholder || 'There is no information to show'}
          </Table.Cell>
        </Table.Row>
      );
    }

    // get data for currentPage
    for (let i = start; i < end; i += 1) {
      const currentCellData = orderedData[i];

      if (currentCellData) {
        dataToShow.push(currentCellData);
      }
    }

    let onRowClick = () => { };

    if (this.props.onRowClick) {
      onRowClick = this.props.onRowClick;
    }

    // render HTML
    return dataToShow.map((rowData, index) => (
      <FadeableRow
        key={index}
        animated={this.props.animated}
        delay={70 * index}
        onClick={() => { onRowClick(rowData); }}
      >
        {this.renderCells(rowData)}
      </FadeableRow>
    ));
  }

  render() {
    return (
      <Table
        selectable
        unstackable
        striped={this.props.striped}
        celled={this.props.celled}
        inverted={this.props.inverted}
        style={this.props.style}
      >
        <Table.Header>
          <Table.Row>
            {this.renderHeader()}
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {this.renderBody()}
          {this.renderTotal()}
          {this.renderFooter()}
        </Table.Body>
      </Table>
    );
  }
}


CustomTable.propTypes = {
  animated: PropTypes.bool,
  celled: PropTypes.bool,
  inverted: PropTypes.bool,
  style: PropTypes.object,
  placeholder: PropTypes.string,
  loading: PropTypes.bool,
  headers: PropTypes.arrayOf(PropTypes.shape({
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
    attribute: PropTypes.string,
    filtered: PropTypes.oneOfType([PropTypes.bool, PropTypes.func]),
    style: PropTypes.object,
    format: PropTypes.oneOf(['capitalize', 'date', 'dateDMY', 'dateTime', 'currency', 'phone']),
    component: PropTypes.element,
  })).isRequired,
  onRowClick: PropTypes.func,
  cellStyle: PropTypes.object,
  footerStyle: PropTypes.object,
  footerDisabled: PropTypes.bool,
  paginatorStyle: PropTypes.object,
  data: PropTypes.arrayOf(PropTypes.object),
  defaultOrder: PropTypes.string,
  orderDirection: PropTypes.string,
  itemsPerPage: PropTypes.number,
  noDataContainer: PropTypes.any,
  striped: PropTypes.bool,
  total: PropTypes.object,
  totalStyle: PropTypes.object,
  totalRowClick: PropTypes.any
};


export default CustomTable;
