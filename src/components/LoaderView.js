import React, { Component } from "react";
import PropTypes from 'prop-types';
import { connect } from "react-redux";
import { Grid, Dimmer, Segment, Loader } from "semantic-ui-react";

const { Column } = Grid;


class LoaderView extends Component {
  render() {
    const { language } = this.props;
    const label = { en: 'Loading View', es: 'Cargando Vista' };

    return (
      <Grid container style={{ marginTop: 40 }}>
        <Column>
          <Segment style={{ height: 100 }}>
            <Dimmer active inverted>
              <Loader>
                { label[language] }
              </Loader>
            </Dimmer>
          </Segment>
        </Column>
      </Grid>
    );
  }
}


LoaderView.propTypes = {
  language: PropTypes.string
};


const mapStateToProps = (state) => ({
  language: state.app.language
});


export default connect(mapStateToProps)(LoaderView);
