import ShlinkApiClient from '../../api/ShlinkApiClient';
import { curry } from 'ramda';
import PropTypes from 'prop-types';
import { _listShortUrls } from './shortUrlsList';

export const EDIT_SHORT_URL_TAGS_START = 'shlink/shortUrlTags/EDIT_SHORT_URL_TAGS_START';
export const EDIT_SHORT_URL_TAGS_ERROR = 'shlink/shortUrlTags/EDIT_SHORT_URL_TAGS_ERROR';
export const EDIT_SHORT_URL_TAGS = 'shlink/shortUrlTags/EDIT_SHORT_URL_TAGS';

export const shortUrlTagsType = PropTypes.shape({
  shortCode: PropTypes.string,
  tags: PropTypes.arrayOf(PropTypes.string).isRequired,
  saving: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
});

const defaultState = {
  shortCode: null,
  tags: [],
  saving: false,
  error: false,
};

export default function reducer(state = defaultState, action) {
  switch (action.type) {
    case EDIT_SHORT_URL_TAGS_START:
      return {
        ...state,
        saving: true,
        error: false,
      };
    case EDIT_SHORT_URL_TAGS_ERROR:
      return {
        ...state,
        saving: false,
        error: true,
      };
    case EDIT_SHORT_URL_TAGS:
      return {
        shortCode: action.shortCode,
        tags: action.tags,
        saving: false,
        error: false,
      };
    default:
      return state;
  }
}

export const _editShortUrlTags = (ShlinkApiClient, shortCode, tags) => async (dispatch, getState) => {
  dispatch({ type: EDIT_SHORT_URL_TAGS_START });

  try {
    await ShlinkApiClient.updateShortUrlTags(shortCode, tags);
    dispatch({ tags, shortCode, type: EDIT_SHORT_URL_TAGS });

    const { shortUrlsListParams } = getState();
    await _listShortUrls(ShlinkApiClient, shortUrlsListParams)(dispatch);
  } catch (e) {
    dispatch({ type: EDIT_SHORT_URL_TAGS_ERROR });
  }
};
export const editShortUrlTags = curry(_editShortUrlTags)(ShlinkApiClient);
