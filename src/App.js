import './App.css';
import React, { Component } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'

const largeColumn = { width: '40%', };
const midColumn = { width: '30%', };
const smallColumn = { width: '10%', };
const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = 100;
const PATH_BASE = 'https://hn.algolia.com/api/v1/';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage='


class App extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      results: null,
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null,
      isLoading: false,
    };
    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
  }

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  fetchSearchTopStories(searchTerm, page = 0) {
    this.setState({ isLoading: true })
    axios(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(result => this._isMounted && this.setSearchTopStories(result.data))
      .catch(error => this._isMounted && this.setState({ error }))
  }
  onSearchSubmit(e) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm })
    this.fetchSearchTopStories(searchTerm)
    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm)
    }
    e.preventDefault();
  }
  setSearchTopStories(result) {
    const { hits, page } = result;
    const { searchKey, results } = this.state;
    const oldHits = results && results[searchKey]
      ? results[searchKey].hits
      : [];
    const updatedHits = [
      ...oldHits,
      ...hits
    ];
    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      },
      isLoading: false,
    })
  }
  componentDidMount() {
    this._isMounted = true;
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm })
    this.fetchSearchTopStories(searchTerm)
  }
  componentWillUnmount() {
    this._isMounted = false;
  }
  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value })
  };
  onDismiss(id) {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];
    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);

    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    });
  };

  render() {
    const {
      searchTerm,
      results,
      searchKey,
      error,
      isLoading,
    } = this.state;

    const page = (
      results &&
      results[searchKey] &&
      results[searchKey].page
    ) || 0;

    const list = (
      results &&
      results[searchKey] &&
      results[searchKey].hits
    ) || [];

    return (
      <div className="page">
        <div className="interactions">
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}>
            Search
        </Search>
        </div>
        {error
          ? <div className="interactions">
            <p>Something went wrong</p>
          </div>
          : <Table
            list={list}
            onDismiss={this.onDismiss} />
        }
        <div className="interactions">
          {isLoading
            ? <Loading />
            : <Button onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
              More
          </Button>}
        </div>
      </div>
    )
  }
}

const Loading = () => <div>Loading <i class="fas fa-spinner"></i></div>

class Search extends Component {
  componentDidMount() {
    if (this.input) {
      this.input.focus()
    }
  }
  render() {
    const {
      value,
      onChange,
      onSubmit,
      children
    } = this.props;
    return (
      <form onSubmit={onSubmit}>
        <input
          type="text"
          value={value}
          onChange={onChange}
          ref={(node) => { this.input = node }} />
        <button type="submit">
          {children}
        </button>
      </form>
    );
  }
}
const Table = ({ list, onDismiss }) =>
  <div className="table">
    {list.map(item =>
      <div key={item.objectID} className="table-row">
        <span style={largeColumn}>
          <a href={item.url}>{item.title}</a>
        </span>
        <span style={midColumn}>{item.author}</span>
        <span style={smallColumn}>{item.num_comments}</span>
        <span style={smallColumn}>{item.points}</span>
        <span style={smallColumn}>
          <Button
            onClick={() => onDismiss(item.objectID)}
            className="button-inline">
            Dismiss
          </Button>
        </span>
      </div>
    )}
  </div>

const Button = ({ onClick, className, children }) =>
  <button
    onClick={onClick}
    className={className}
    type="button">
    {children}
  </button>

Button.defaultProps = {
  className: '',
};
Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};
Table.propTypes = {
  list: PropTypes.arrayOf(
    PropTypes.shape({
      objectID: PropTypes.string.isRequired,
      author: PropTypes.string,
      url: PropTypes.string,
      num_comments: PropTypes.number,
      points: PropTypes.number
    })
  ).isRequired,
  onDismiss: PropTypes.func.isRequired
};
Search.propTypes = {
  children: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default App;

export {
  Search,
  Button,
  Table,
}