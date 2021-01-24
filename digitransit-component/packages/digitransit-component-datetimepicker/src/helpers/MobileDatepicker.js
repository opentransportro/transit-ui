import PropTypes from 'prop-types';
import React, { useState, useRef, useLayoutEffect } from 'react';
import moment from 'moment-timezone';
import Autosuggest from 'react-autosuggest';
import styles from './styles.scss';
import { isAndroid } from './mobileDetection';

/**
 * Component to display a date input on mobile
 */
function MobileDatepicker({
  value,
  getDisplay,
  onChange,
  itemCount,
  startTime,
  id,
  label,
  icon,
  timeZone,
}) {
  moment.tz.setDefault(timeZone);

  const [open, changeOpen] = useState(false);
  const scrollRef = useRef(null);
  const day = 1000 * 60 * 60 * 24;
  const dateChoices = Array(itemCount)
    .fill()
    .map((_, i) => startTime + i * day);
  const minute = 1000 * 60;
  const diffs = dateChoices.map(t => value - t);
  const scrollIndex = diffs.findIndex(t => t < minute); // when time is now, the times might differ by less than one minute
  const elementHeight = 50;
  // scroll to selected time when dropdown is opened
  useLayoutEffect(() => {
    if (open && scrollRef.current) {
      scrollRef.current.scrollTop = elementHeight * scrollIndex;
    }
  }, [value, open]);
  const startFormatted = moment(startTime).format('YYYY-MM-DD');
  const endFormatted = moment(startTime)
    .add(itemCount, 'day')
    .format('YYYY-MM-DD');
  const nativeInput = !isAndroid();
  const inputId = `${id}-input`;
  const labelId = `${id}-label`;
  return (
    <>
      <label className={styles['input-container']} htmlFor={inputId}>
        <span>{icon}</span>
        <span className={styles['sr-only']} id={labelId}>
          {label}
        </span>
        {nativeInput ? (
          <>
            <span className={styles['mobile-input-display']}>
              {getDisplay(value)}
            </span>
            <input
              id={inputId}
              type="date"
              className={styles['mobile-input-hidden']}
              value={moment(value).format('YYYY-MM-DD')}
              min={startFormatted}
              max={endFormatted}
              onChange={event => {
                const newValue = event.target.value;
                if (!newValue) {
                  // don't allow setting input to empty
                  return;
                }
                const oldDate = moment(value);
                const newDate = moment(newValue);
                const combined = oldDate
                  .year(newDate.year())
                  .month(newDate.month())
                  .date(newDate.date());
                onChange(combined.valueOf());
              }}
            />
          </>
        ) : (
          <Autosuggest
            id={id}
            suggestions={dateChoices}
            getSuggestionValue={s => s.toString()}
            renderSuggestion={s => getDisplay(s)}
            onSuggestionsFetchRequested={() => null}
            shouldRenderSuggestions={() => true}
            inputProps={{
              value: getDisplay(value),
              onChange: (_, { newValue }) => {
                onChange(Number(newValue));
              },
              onFocus: () => {
                changeOpen(true);
              },
              onBlur: () => {
                changeOpen(false);
              },
              id: inputId,
              'aria-labelledby': labelId,
              'aria-autocomplete': 'none',
              readOnly: true,
            }}
            focusInputOnSuggestionClick={false}
            onSuggestionsClearRequested={() => null}
            renderSuggestionsContainer={({ containerProps, children }) => {
              // set refs for autosuggest library and scrollbar positioning
              const { ref, ...otherRefs } = containerProps;
              const containerRef = elem => {
                if (elem) {
                  scrollRef.current = elem;
                  ref(elem);
                }
              };
              return (
                <div tabIndex="-1" {...otherRefs} ref={containerRef}>
                  {children}
                </div>
              );
            }}
            theme={styles}
          />
        )}
      </label>
    </>
  );
}
MobileDatepicker.propTypes = {
  value: PropTypes.number.isRequired,
  getDisplay: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  itemCount: PropTypes.number.isRequired,
  startTime: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  icon: PropTypes.node,
  dateTimeCombined: PropTypes.bool,
  timeZone: PropTypes.string,
};

MobileDatepicker.defaultProps = {
  icon: null,
  dateTimeCombined: false,
  timeZone: 'Europe/Helsinki',
};

export default MobileDatepicker;
