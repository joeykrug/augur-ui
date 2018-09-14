import React from "react";

import { Helmet } from "react-helmet";
import PropTypes from "prop-types";

import ReportingHeader from "modules/reporting/containers/reporting-header";
import MarketPreview from "modules/market/containers/market-preview";
import Paginator from "modules/common/components/paginator/paginator";
import MarketsHeaderLabel from "modules/markets-list/components/markets-header-label/markets-header-label";
import NullStateMessage from "modules/common/components/null-state-message/null-state-message";

export const ReportSection = ({
  title,
  items,
  nullMessage,
  pageinationName,
  setSegment,
  lower,
  boundedLength,
  history,
  location,
  pageinationCount,
  addNullPadding
}) => {
  let theChildren;
  const count = items.length;
  if (items.length === 0) {
    theChildren = (
      <NullStateMessage
        message={nullMessage || "No Markets Available"}
        key={title}
        addNullPadding={addNullPadding}
      />
    );
  } else {
    const itemLength = boundedLength + (lower - 1);
    const newItems = items.slice(lower - 1, itemLength);

    theChildren = newItems.map(item => (
      <MarketPreview key={item.id} {...item} />
    ));
  }

  return (
    <article>
      <MarketsHeaderLabel title={title} />
      <article>
        <section>{theChildren}</section>
        {count > pageinationCount && (
          <Paginator
            itemsLength={count}
            itemsPerPage={pageinationCount}
            location={location}
            history={history}
            setSegment={setSegment}
            pageParam={pageinationName}
          />
        )}
      </article>
    </article>
  );
};

ReportSection.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  pageinationName: PropTypes.string.isRequired,
  pageinationCount: PropTypes.number.isRequired,
  nullMessage: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  setSegment: PropTypes.func.isRequired,
  lower: PropTypes.number.isRequired,
  boundedLength: PropTypes.number.isRequired,
  items: PropTypes.arrayOf(PropTypes.object),
  addNullPadding: PropTypes.bool
};

class ReportingReporting extends React.Component {
  constructor(props) {
    super(props);

    const PAGINATION_LENGTH = 10;
    const paginations = {
      dr: {
        lower: 1,
        boundedLength: PAGINATION_LENGTH
      },
      or: {
        lower: 1,
        boundedLength: PAGINATION_LENGTH
      },
      ur: {
        lower: 1,
        boundedLength: PAGINATION_LENGTH
      }
    };

    this.state = {
      paginations,
      PAGINATION_LENGTH
    };

    this.setDrSegment = this.setDrSegment.bind(this);
    this.setOrSegment = this.setOrSegment.bind(this);
    this.setUrSegment = this.setUrSegment.bind(this);
  }

  componentDidMount() {
    const { loadReporting } = this.props;
    loadReporting();
  }

  setDrSegment(lower, upperBound, boundedLength) {
    this.keyedSetSegment(lower, upperBound, boundedLength, "dr");
  }

  setOrSegment(lower, upperBound, boundedLength) {
    this.keyedSetSegment(lower, upperBound, boundedLength, "or");
  }

  setUrSegment(lower, upperBound, boundedLength) {
    this.keyedSetSegment(lower, upperBound, boundedLength, "ur");
  }

  keyedSetSegment(lower, upperBound, boundedLength, key) {
    const { paginations } = this.state;
    paginations[key] = { lower, boundedLength };
    this.setState(paginations);
  }

  render() {
    const { history, location, markets } = this.props;
    const { designated, open, upcoming } = markets;
    const { paginations, PAGINATION_LENGTH } = this.state;

    return (
      <section>
        <Helmet>
          <title>Reporting: Markets</title>
        </Helmet>
        <ReportingHeader heading="Markets" />
        <ReportSection
          location={location}
          history={history}
          pageinationCount={PAGINATION_LENGTH}
          title="Designated Reporting"
          items={designated}
          nullMessage="There are no markets available for you to report on. "
          pageinationName="designated"
          lower={paginations.dr.lower}
          boundedLength={paginations.dr.boundedLength}
          setSegment={this.setDrSegment}
        />
        <ReportSection
          location={location}
          history={history}
          pageinationCount={PAGINATION_LENGTH}
          title="Open Reporting"
          items={open}
          nullMessage="There are no markets in Open Reporting."
          pageinationName="open"
          lower={paginations.or.lower}
          boundedLength={paginations.or.boundedLength}
          setSegment={this.setOrSegment}
        />
        <ReportSection
          location={location}
          history={history}
          pageinationCount={PAGINATION_LENGTH}
          title="Upcoming Reporting"
          items={upcoming}
          buttonText="View"
          nullMessage="There are no upcoming markets for you to report on."
          pageinationName="upcoming"
          lower={paginations.ur.lower}
          boundedLength={paginations.ur.boundedLength}
          setSegment={this.setUrSegment}
          addNullPadding
        />
      </section>
    );
  }
}

ReportingReporting.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  markets: PropTypes.object.isRequired,
  loadReporting: PropTypes.func.isRequired
};

export default ReportingReporting;
