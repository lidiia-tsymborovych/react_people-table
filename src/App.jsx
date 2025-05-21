import React, { useState } from 'react';

import '@fortawesome/fontawesome-free/css/all.css';
import 'bulma/css/bulma.css';
import './App.scss';

import peopleFromServer from './people.json';

const COLUMNS = ['name', 'sex', 'born', 'died', 'actions'];
const BUTTONS = ['all', 'm', 'f'];

function getFilteredPeople(people, filterParam, query) {
  let res = [...people];

  if (query) {
    const queryNormalised = query.trim().toLowerCase();

    res = [...res].filter(p => {
      const nameNormalised = p.name.trim().toLowerCase();

      return nameNormalised.includes(queryNormalised);
    });
  }

  if (filterParam === 'm') {
    res = [...res].filter(p => p.sex === 'm');
  } else if (filterParam === 'f') {
    res = [...res].filter(p => p.sex === 'f');
  }

  return res;
}

export function App() {
  const [selectedPeople, setSelectedPeople] = useState([]);
  const [filterBy, setFilterBy] = useState('');
  const [query, setQuery] = useState('');

  const handleClickAddPerson = person =>
    setSelectedPeople(currentPeople => [...currentPeople, person]);
  const handleClickRemovePerson = person =>
    setSelectedPeople(currentPeople => currentPeople.filter(p => p !== person));

  const filteredPeople = getFilteredPeople(peopleFromServer, filterBy, query);

  return (
    <div className="box">
      <h1 className="title">People table</h1>
      <input
        style={{ height: 32, width: 340, marginBottom: 32 }}
        value={query}
        type="text"
        onChange={event => setQuery(event.target.value.trimStart())}
      />
      <button
        type="button"
        className="button is-small mx-4 is-danger"
        onClick={() => setQuery('')}
      >
        reset
      </button>

      <table className="table is-striped is-narrow">
        <caption className="title is-5 has-text-info">
          {selectedPeople.length
            ? selectedPeople.map(person => person.name).join(', ')
            : 'No people selected'}
        </caption>
        <thead>
          <tr>
            {BUTTONS.map(butt => (
              <button
                key={butt}
                type="button"
                className={`button is-small mr-4 ${filterBy === butt ? 'is-success' : ''}`}
                style={{ width: 60 }}
                onClick={() => {
                  if (filterBy !== butt) setFilterBy(butt);
                }}
              >
                {butt}
              </button>
            ))}
          </tr>
          <tr>
            {COLUMNS.map(col => (
              <th key={col}>{col}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {filteredPeople.map(person => (
            <tr key={person.slug}>
              <td>{person.name}</td>
              <td>{person.sex}</td>
              <td>{person.born}</td>
              <td>{person.died}</td>
              <td>
                {selectedPeople.includes(person) ? (
                  <button
                    type="button"
                    className="button is-small is-danger"
                    onClick={() => handleClickRemovePerson(person)}
                  >
                    -
                  </button>
                ) : (
                  <button
                    type="button"
                    className="button is-small is-success"
                    onClick={() => handleClickAddPerson(person)}
                  >
                    +
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
