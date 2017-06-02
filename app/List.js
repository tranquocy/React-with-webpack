import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Card from './Card';
class List extends React.Component {
  render() {
    let cards = this.props.cards.map((card) => {
      return <Card key={card.id} taskCallbacks={this.props.taskCallbacks} {...card} />
    });
    return (
      <div className="list">
        <h1>{this.props.title}</h1>
        {cards}
      </div>
    );
  }
};

List.propTypes = {
  title: React.PropTypes.string.isRequired,
  cards: React.PropTypes.arrayOf(PropTypes.object),
  taskCallbacks: PropTypes.object,
}

export default List;