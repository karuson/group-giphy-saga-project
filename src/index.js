import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './components/App/App';
import axios from 'axios'
import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'
import logger from 'redux-logger'
import createSagaMiddleware from 'redux-saga'
import { takeLatest, put } from 'redux-saga/effects'


function* rootSaga() {
  yield takeLatest('GET_GIFS', fetchGifList)
}

function* fetchGifList() {
  const gifList = yield axios.get('/api/favorite')
  yield put ({ type: 'SET_GIF_LIST', payload: gifList.data })
}

const gifReducer = ( state = [], action ) => {
  switch(action.type) {
    case 'SET_GIF_LIST':
      return action.payload
    default: 
      return state
  }
}

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
  combineReducers({ 
    gifReducer,
  }),
  applyMiddleware( sagaMiddleware, logger )
)

sagaMiddleware.run( rootSaga )

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
      <Provider store={store}>
        <App />
      </Provider>
    </React.StrictMode>
);
